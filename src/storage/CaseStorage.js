// src/utils/CaseUtils.js
const CaseModel = require('../models/Case');
const mongoose = require('mongoose');
const ProviderModel= require('../models/Provider')
const ClientModel= require('../models/Client')
const HospitalModel= require('../models/Hospital')
const { Types } = mongoose;

class CaseStorage {
    static async getAllCases() {
        return CaseModel.find().lean();
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

