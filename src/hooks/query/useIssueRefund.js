
import { useMutation } from "@tanstack/react-query";
import { placeRefundIssuanceRequest } from "@/api";

export const useIssueRefund = (options = {}) => {
    return useMutation({
        mutationFn: placeRefundIssuanceRequest,
        ...options,
    });
};
