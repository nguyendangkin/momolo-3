"use server";

import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";

export const createNote = async (data: INote): Promise<any> => {
    try {
        const res = await sendRequest({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_API_URL}/notes`,
            body: data,
        });
        return res;
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi không mong muốn",
        };
    }
};

export const getNote = async (id: string): Promise<any> => {
    try {
        const res = await sendRequest({
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
        });
        return res;
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi không mong muốn",
        };
    }
};

export const getAllDonates = async (page = 1, limit = 20): Promise<any> => {
    try {
        const res = await sendRequest({
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_API_URL}/pays/get-all`,
            queryParams: {
                page: Number(page),
                limit: Number(limit),
            },
        });
        return res;
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi không mong muốn",
        };
    }
};

export const submitDonation = async (
    username: string,
    money: number
): Promise<any> => {
    try {
        const res = await sendRequest({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_API_URL}/pays/donate`,
            body: {
                username,
                money,
            },
        });
        return res;
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi không mong muốn",
        };
    }
};
