import { Document, FilterQuery, Model } from "mongoose";
import { ICreateCollections, IUpdateCollections, ICollections } from "../interfaces";

class GenericService<T extends Document> {
    constructor(public model: Model<T>) {
        this.model = model;
    }
    
      async create(data: T | ICreateCollections) {
        return this.model.create(data);
      }

    async updateOne(filter: FilterQuery<T>, data: IUpdateCollections, fields?: string) {
        fields = fields ? `-__v -updatedAt -deleted ${fields}` : `-__v -updatedAt -deleted`
        return await this.model.findOneAndUpdate(filter, data, { new: true })
        .select(fields);
    }

    async updateMany(filter: FilterQuery<T>, data: IUpdateCollections) {
        return await this.model.updateMany(filter, {$set: data})
    }

    async deleteOne(filter: FilterQuery<T>) {
        return await this.model.findOneAndDelete(filter);
    }

    async disableOne(filter: FilterQuery<T>) {
        return await this.updateOne(filter, {deleted: true});
    }

    async disableMany(filter: FilterQuery<T>) {
        return await this.updateMany(filter, {deleted: true});
    }

    async findOne(filter: FilterQuery<T>, fields?: string) {
        fields = fields ? `-__v -updatedAt -deleted ${fields}` : `-__v -updatedAt -deleted`
        filter = { deleted: false, ...filter}
        return await this.model.findOne(filter)
        .select(fields);
    }

    async findOneToDelete(filter: FilterQuery<T>) {
        return await this.model.findOne(filter)
    }

    async findAll(filter: FilterQuery<T>, fields?: string) {
        fields = fields ? `-__v -updatedAt -deleted ${fields}` : `-__v -updatedAt -deleted`
        const page = filter?.page ? parseInt(filter?.page) : 1;
        const resourcePerPage = filter?.limit ? parseInt(filter?.limit) : 10;
        
        delete filter?.page
        delete filter?.limit
    
        let data: Document<unknown, {}, ICollections>[];
        let totalCount: number;
        
        if (filter) {
            filter = filter?.deleted ? filter 
            : filter.hasOwnProperty('deleted') 
            ? filter : { deleted: false, ...filter }
            
            totalCount = await this.model.countDocuments(filter);
            data = await this.model.find(filter)
                .skip((page - 1) * resourcePerPage)
                .limit(resourcePerPage)
                .sort({ createdAt: 1 })
                .select(fields);
        } else {
            totalCount = await this.model.countDocuments({ deleted: false });
            data = await this.model.find({ deleted: false})
                .skip((page - 1) * resourcePerPage)
                .limit(resourcePerPage)
                .sort({ createdAt: 1 })
                .select(fields);
        }
        
        return {
            data,
            currentPage: page,
            totalPages: Math.ceil(totalCount / resourcePerPage)
        };
    }
}

export default GenericService;