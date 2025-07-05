// src/utils/CaseUtils.js
const CaseModel = require('../models/Case');
const mongoose = require('mongoose');
const ProviderModel = require('../models/Provider')
const ClientModel = require('../models/Client')
const HospitalModel = require('../models/Hospital')
const logIssue = require('../utils/Logger');
const { Types } = mongoose;

class CaseStorage {
    static async getAllCases(status, startDate, endDate, user) {
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (user.role === 'employee') {
            filter.createdById = user.id;
        }

        // Default date range: last 6 months
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate ? new Date(startDate) : new Date(end);
        if (!startDate) {
            start.setMonth(start.getMonth() - 6);
        }

        filter.createdAt = { $gte: start, $lte: end };

        return CaseModel.find(filter).lean();
    }

    static async getMonthlyCountsGrouped(status, groupBy, startDate, endDate) {
        const dateField = status === 'closed' ? 'closedAt' : 'createdAt';

        const match = {
            [dateField]: { $gte: startDate, $lte: endDate }
        };

        if (status) {
            match.status = status;
        }

        let groupField = '';
        if (groupBy === 'hospitals') {
            match.hospital = { $exists: true, $ne: null };
            groupField = '$hospital';
        } else if (groupBy === 'clients') {
            match.insuranceType = 'clients';
            match.insurance = { $exists: true, $ne: null };
            groupField = '$insurance';
        } else if (groupBy === 'providers') {
            match.insuranceType = 'providers';
            match.insurance = { $exists: true, $ne: null };
            groupField = '$insurance';
        }

        const result = await CaseModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        groupName: groupField,
                        year: { $year: `$${dateField}` },
                        month: { $month: `$${dateField}` }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.groupName': 1, '_id.year': 1, '_id.month': 1 } }
        ]);

        // Step 1: Generate all month keys in range
        const monthKeys = [];
        const current = new Date(startDate);
        current.setDate(1);
        while (current <= endDate) {
            const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
            monthKeys.push(key);
            current.setMonth(current.getMonth() + 1);
        }

        // Step 2: Organize counts by groupName
        const groupedCounts = {};

        for (const { _id, count } of result) {
            const groupName = _id.groupName;
            const monthKey = `${_id.year}-${String(_id.month).padStart(2, '0')}`;

            if (!groupedCounts[groupName]) {
                groupedCounts[groupName] = {};
            }
            groupedCounts[groupName][monthKey] = count;
        }

        // Step 3: Format response: fill missing months with 0
        const finalResult = {};
        for (const groupName in groupedCounts) {
            finalResult[groupName] = monthKeys.map(month => groupedCounts[groupName][month] || 0);
        }

        return finalResult;
    }

    static async getClosedCaseCountsByUser(startDate, endDate) {
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate ? new Date(startDate) : new Date(end);
        if (!startDate) {
            start.setMonth(start.getMonth() - 6); // default to last 6 months
        }

        return CaseModel.aggregate([
            {
                $match: {
                    status: 'closed',
                    closedAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        createdById: '$createdById',
                        createdBy: '$createdBy'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    createdById: '$_id.createdById',
                    createdBy: '$_id.createdBy',
                    count: 1
                }
            },
            { $sort: { count: -1 } } // optional: sort by count descending
        ]);
    }


    static async getCaseById(id) {
        return CaseModel.findById(id).lean();
    }

    static async validateAndCreateCase(data) {
        try {
            let InsuranceModel;

            if (data.insuranceType === 'clients') {
                InsuranceModel = ClientModel;
            } else if (data.insuranceType === 'providers') {
                InsuranceModel = ProviderModel;
            } else if (data.insuranceType === 'hospitals') {
                InsuranceModel = HospitalModel;
            }

            const insuranceData = await InsuranceModel.exists({ _id: data.insuranceId });
            if (!insuranceData) {
                throw new Error(`${data.insuranceType} with provided ID does not exist`);
            }

            const hospitalData = await HospitalModel.exists({ _id: data.hospitalId });
            if (!hospitalData) {
                throw new Error('Hospital with provided ID does not exist');
            }
            return CaseModel.create(data);
        } catch (error) {
            await logIssue('Issue in case creation', error.message, {
                error
            });
            return error.message;
        }
    }

    static async updateCase(id, data) {
        try {
            return CaseModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
        } catch (error) {
            await logIssue('Issue in case creation', error.message, {
                error
            });
            return error.message;
        }
    }

    static async deleteCase(id) {
        try {
            return CaseModel.findByIdAndDelete(id).lean();
        } catch (error) {
            await logIssue('Issue in case creation', error.message, {
                error
            });
            return error.message;
        }
    }

    /**
      * Get count of active cases grouped by entity ID (clients, providers, or hospitals)
      * @param {'clients' | 'providers' | 'hospitals'} entityType
      * @param {string[]} entityIds
      * @returns {Promise<Object>} - Map of { entityId: count }
      */
    static async getActiveCasesCountForEntities(entityType, entityIds) {
        if (!['clients', 'providers', 'hospitals'].includes(entityType)) {
            throw new Error('Invalid entityType. Must be one of: clients, providers, hospitals');
        }

        const objectIds = entityIds
            .filter(id => id && (Types.ObjectId.isValid(id) || id instanceof Types.ObjectId))
            .map(id => (id instanceof Types.ObjectId ? id : new Types.ObjectId(id)));
        const matchStage = {
            status: 'open'
        };

        if (entityType === 'hospitals') {
            matchStage.hospitalId = { $in: objectIds };
        } else {
            matchStage.insuranceType = entityType;
            matchStage.insuranceId = { $in: objectIds };
        }

        const groupField = entityType === 'hospitals' ? '$hospitalId' : '$insuranceId';

        const results = await CaseModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: groupField,
                    count: { $sum: 1 }
                }
            }
        ]);

        const countMap = {};
        results.forEach(result => {
            countMap[result._id.toString()] = result.count;
        });

        return countMap;
    }


}

module.exports = CaseStorage;

