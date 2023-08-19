import { Document } from "mongoose";

export const formatSingleResponse = (response: Document) => {
    const id = response._id.toString();
    let newResponse = response.toObject();
    delete newResponse._id;
    delete newResponse.__v;
    newResponse.id = id;

    return newResponse;
};

export const formatArrayResponse = (response: Array<Document>) => {
    return response.map((doc) => {
        const id = doc._id.toString();
        let newDoc = doc.toObject();
        delete newDoc._id;
        delete newDoc.__v;
        newDoc.id = id;

        return newDoc;
    });
};

export const formatSingleResponseWithNoPassword = (response: Document) => {
    const id = response._id.toString();
    let newResponse = response.toObject();
    delete newResponse._id;
    delete newResponse.__v;
    delete newResponse.password;
    newResponse.id = id;

    return newResponse;
};
