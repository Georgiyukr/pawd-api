import { Document } from "mongoose";

export const formatSingleResponse = (response: Document) => {
    const id = response._id;
    let newResponse = response.toObject();
    delete newResponse._id;
    delete newResponse.__v;
    newResponse.id = id;

    return newResponse;
};
