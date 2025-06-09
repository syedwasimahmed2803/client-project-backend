// src/utils/CaseUtils.js
const CaseModel = require('../models/Case');
const mongoose = require('mongoose');
const ProviderModel = require('../models/Provider')
const ClientModel = require('../models/Client')
const HospitalModel = require('../models/Hospital')
const { Types } = mongoose;

class CaseStorage {
    static async getAllCases() {
        return CaseModel.find().lean();
    }

    static async getMonthlyCountsGrouped(status, groupBy, startDate, endDate) {
        const dateField = status === 'closed' ? 'closedAt' : 'createdAt';

        const match = {
            [dateField]: { $gte: startDate, $lte: endDate }
        };

        if (status) {
            match.status = status;
        }

        if (groupBy === 'Hospital') {
            match.hospitalId = { $exists: true, $ne: null };
        } else if (groupBy === 'Client') {
            match.insuranceType = 'Client';
            match.insuranceId = { $exists: true, $ne: null };
        } else if (groupBy === 'Provider') {
            match.insuranceType = 'Provider';
            match.insuranceId = { $exists: true, $ne: null };
        }

        const result = await CaseModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        year: { $year: `$${dateField}` },
                        month: { $month: `$${dateField}` }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Build the complete list of months between startDate and endDate
        const monthKeys = [];
        const current = new Date(startDate);
        current.setDate(1); // ensure start at beginning of month

        while (current <= endDate) {
            const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
            monthKeys.push(key);
            current.setMonth(current.getMonth() + 1);
        }

        // Map the result to month counts
        const flatMap = {};
        for (const { _id, count } of result) {
            const key = `${_id.year}-${String(_id.month).padStart(2, '0')}`;
            flatMap[key] = count;
        }

        return monthKeys.map(key => flatMap[key] || 0);
    }



    static async getCaseById(id) {
        return CaseModel.findById(id).lean();
    }

    static async validateAndCreateCase(data) {
        let InsuranceModel;

        if (data.insuranceType === 'Client') {
            InsuranceModel = ClientModel;
        } else if (data.insuranceType === 'Provider') {
            InsuranceModel = ProviderModel;
        }

        const insuranceExists = await InsuranceModel.exists({ _id: data.insuranceId });
        if (!insuranceExists) {
            throw new Error(`${data.insuranceType} with provided ID does not exist`);
        }

        const hospitalExists = await HospitalModel.exists({ _id: data.hospitalId });
        if (!hospitalExists) {
            throw new Error('Hospital with provided ID does not exist');
        }

        return CaseModel.create(data);
    }

    static async updateCase(id, data) {
        return CaseModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    static async deleteCase(id) {
        return CaseModel.findByIdAndDelete(id).lean();
    }

    /**
      * Get count of active cases grouped by entity ID (client, provider, or hospital)
      * @param {'client' | 'provider' | 'hospital'} entityType
      * @param {string[]} entityIds
      * @returns {Promise<Object>} - Map of { entityId: count }
      */
    static async getActiveCasesCountForEntities(entityType, entityIds) {
        if (!['Client', 'Provider', 'Hospital'].includes(entityType)) {
            throw new Error('Invalid entityType. Must be one of: client, provider, hospital');
        }

        const objectIds = entityIds
            .filter(id => id && (Types.ObjectId.isValid(id) || id instanceof Types.ObjectId))
            .map(id => (id instanceof Types.ObjectId ? id : new Types.ObjectId(id)));
        const matchStage = {
            status: 'open'
        };

        if (entityType === 'Hospital') {
            matchStage.hospitalId = { $in: objectIds };
        } else {
            matchStage.insuranceType = entityType;
            matchStage.insuranceId = { $in: objectIds };
        }

        const groupField = entityType === 'Hospital' ? '$hospitalId' : '$insuranceId';

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

