import axios from "axios";
import { BASE_URL } from "@/utils/getUrls";
import { PlayerType } from "@/functions/getPlayers";

/** Paginated Player Response from the "show" method in the controller */
export interface PaginatedPlayersResponse {
    _links: {
        self: string;
        next: string | null;
        prev: string | null;
    };
    data: PlayerType[];
}

/** Friendship record for update or other usage */
export interface Friendship {
    id: string;
    requester_id: string;
    addressee_id: string;
    status: string;
    // etc.
}

/**
 * Get a paginated list of players by status for a given player, optionally filtering by search `q`.
 * e.g. GET /players/{playerId}/friendships?status=sent&q=someSearchTerm
 */
export async function getFriendships(
    playerId: string,
    status: string,
    q?: string,
    next?: string
): Promise<PaginatedPlayersResponse | null> {
    try {
        let url, response;
        if(!next) {
            url = `${BASE_URL}/friendships/${playerId}`;
            // Pass `status` and optional `q` param
            response = await axios.get(url, {
                params: { status, q },
            });
        } else {
            response = await axios.get(`${BASE_URL}${next}`);
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching friendships:", error);
        return null;
    }
}

/**
 * Create a new friend request from playerId to targetId.
 * e.g. POST /players/{playerId}/friendships with { target_id }
 */
export async function createFriendship(
    playerId: string,
    targetId: string
): Promise<{} | null> {
    try {
        const url = `${BASE_URL}/friendships`;
        const payload = { player_id: playerId, target_id: targetId };

        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.error("Error creating friendship:", error);
        return null;
    }
}

/**
 * Update a friendship status, e.g. "accepted", "rejected", etc.
 * e.g. PUT /friendships/{friendshipId} with { status: "accepted" }
 */
export async function updateFriendship(
    playerId: string,
    targetId: string
): Promise<{} | null> {
    try {
        const url = `${BASE_URL}/friendships`;
        const payload = {  player_id: playerId, target_id: targetId };

        const response = await axios.put(url, payload);
        return response.data;
    } catch (error) {
        console.error("Error updating friendship:", error);
        return null;
    }
}

/**
 * Delete a friendship record entirely.
 * e.g. DELETE /friendships?playerId=...&targetId=...
 */
export async function deleteFriendship(playerId: string, targetId: string): Promise<boolean> {
    try {
        const url = `${BASE_URL}/friendships/?player_id=${playerId}&target_id=${targetId}`;
        await axios.delete(url);
        return true; // success
    } catch (error) {
        console.error("Error deleting friendship:", error);
        return false; // failed
    }
}
