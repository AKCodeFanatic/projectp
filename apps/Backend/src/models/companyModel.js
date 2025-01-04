import Company  from "../schema/company/companySchema.js";
import JNF from "../schema/company/jnfSchema.js";
import apiResponse from "../utils/apiResponse.js";

export default class companyModel {
    company = Company;

    async createCompany(companyData, userId) {
        console.log("Company Model: createCompany called");
        const {companyName, email, website} = companyData;
        try {
            const createdCompany = await this.company.create(
                {
                    user: userId,
                    companyName: companyName, 
                    email: email, 
                    website: website
                } 
            );
            console.log(createdCompany);
            return new apiResponse(201, null, "Company created successfully", createdCompany);
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async findCompanyById(id) {
        console.log("Model layer: findCompanyById called");
    
        try {
            const company = await this.company.findById(id).populate("JNFs"); 
            if (!company) {
                return null; 
            }
    
            return new apiResponse(200, company, "Company retrieved successfully"); 
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async updateCompany(id, updates) {
        console.log("Company Model: updateCompany called");
        try {
            const updatedCompany = await this.company.findByIdAndUpdate(id, updates, { new: true });
            console.log(updatedCompany);

            if (!updatedCompany)
                { 
                    console.log("not updated");
                    return null;
                }
            return updatedCompany;

        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async deleteCompany(id) {
        console.log("Company Model: deleteCompany called");
        try {
            const deletedCompany = await this.company.findByIdAndDelete(id);
            if (!deletedCompany) {
                return new apiResponse(404, null, "Company not found");
            }
            return new apiResponse(200, null, "Company deleted successfully");
            
        } catch (error) {
            console.error("Error in deleteCompany:", error.message);
            return new apiResponse(500, null, "Internal server error");
        }
    }

    async addJNFToCompany(companyId, jnfData, userId) {
        console.log("Company Model: addJNFToComapany called");
        try {
            const company = await this.company.findById(companyId);
            if (!company) {
                console.log("Error in fetching company");
                return new apiResponse(404, null, "Company not found");
            }

            jnfData.submittedBy = userId; 
            jnfData.submissionDate = new Date();

            const createdJNF = await JNF.create(jnfData);
            company.JNFs.push(createdJNF._id);

            await company.save();

            return new apiResponse(200, createdJNF, "JNF added successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }


    async getJNFsForCompany(companyId) {
        console.log("Company Model: getJNFsForCompany called");
        try {
            const company = await this.company.findById(companyId).populate("JNFs");
            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }
            return new apiResponse(200, company.JNFs, "JNFs fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

}
