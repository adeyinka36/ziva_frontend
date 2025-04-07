import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "react-native-heroicons/solid";
import Toast from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  getFriendships,
  createFriendship,
  updateFriendship,
  deleteFriendship,
} from "@/functions/getFriends";
import { PlayerType } from "@/functions/getPlayers";
import { useAuth } from "@/contexts/auth";
import { HeaderContext } from "@/contexts/header";

import FriendItem from "@/components/friendItem";

type FriendSegment = "friends" | "sent" | "received";

const FriendsScreen = () => {
  const { user } = useAuth();
  const { setTitle } = useContext(HeaderContext);

  // Current segment/tab
  const [segment, setSegment] = useState<FriendSegment>("friends");

  // Search text in state
  const [searchValue, setSearchValue] = useState("");

  // *** FRIENDS TAB ***
  const [friendsData, setFriendsData] = useState<PlayerType[]>([]);
  const [friendsHasNext, setFriendsHasNext] = useState(false);
  const [friendsNextPage, setFriendsNextPage] = useState("");

  // *** SENT TAB ***
  const [sentData, setSentData] = useState<PlayerType[]>([]);
  const [sentHasNext, setSentHasNext] = useState(false);
  const [sentNextPage, setSentNextPage] = useState("");

  // *** RECEIVED TAB ***
  const [receivedData, setReceivedData] = useState<PlayerType[]>([]);
  const [receivedHasNext, setReceivedHasNext] = useState(false);
  const [receivedNextPage, setReceivedNextPage] = useState("");

  // Set the screen title
  useEffect(() => {
    setTitle("Friends");
  }, [setTitle]);

  // ---------------------------
  // Whenever segment changes:
  // Reset that segment’s pagination/data,
  // Then load with nextPage=''
  // ---------------------------
  useEffect(() => {
    if (!user) return;

    if (segment === "friends") {
      setFriendsData([]);
      setFriendsHasNext(false);
      setFriendsNextPage("");
      loadSegmentData("friends", searchValue, "");
    } else if (segment === "sent") {
      setSentData([]);
      setSentHasNext(false);
      setSentNextPage("");
      loadSegmentData("sent", searchValue, "");
    } else if (segment === "received") {
      setReceivedData([]);
      setReceivedHasNext(false);
      setReceivedNextPage("");
      loadSegmentData("received", searchValue, "");
    }
  }, [segment, user]);

  // ---------------------------
  // loadSegmentData
  //    (seg, customSearch?, nextPageOverride?)
  // ---------------------------
  const loadSegmentData = useCallback(
    async (
      seg: FriendSegment,
      customSearch: string = "",
      nextPageOverride?: string
    ) => {
      if (!user) return;

      const status = seg === "friends" ? "accepted" : seg;

      // If nextPageOverride is provided, use that. Else use the state for that segment
      let currentNextPage: string;
      if (typeof nextPageOverride === "string") {
        currentNextPage = nextPageOverride;
      } else {
        if (seg === "friends") currentNextPage = friendsNextPage;
        else if (seg === "sent") currentNextPage = sentNextPage;
        else currentNextPage = receivedNextPage;
      }

      try {
        const res = await getFriendships(
          user.id,
          status,
          customSearch,
          currentNextPage
        );
        if (!res) return;

        const newHasNext = !!res._links?.next;
        const newNextPage = newHasNext ? res._links.next : "";

        // Utility to merge & de-duplicate
        const mergeAndClean = (
          prev: PlayerType[],
          incoming: PlayerType[]
        ): PlayerType[] => {
          // Remove current user
          const filtered = incoming.filter((p) => p.id !== user.id);

          // Merge
          const combined = [...prev, ...filtered];

          // De-duplicate
          const unique = combined.filter(
            (item, idx, arr) => arr.findIndex((x) => x.id === item.id) === idx
          );

          // Sort friend-first
          unique.sort((a, b) => {
            if (a.is_friend && !b.is_friend) return -1;
            if (!a.is_friend && b.is_friend) return 1;
            return 0;
          });
          return unique;
        };

        // Update the relevant segment's states
        if (seg === "friends") {
          setFriendsData((prev) =>
            currentNextPage ? mergeAndClean(prev, res.data) : [...res.data]
          );
          setFriendsHasNext(newHasNext);
          setFriendsNextPage(newNextPage ? newNextPage : "");
        } else if (seg === "sent") {
          setSentData((prev) =>
            currentNextPage ? mergeAndClean(prev, res.data) : [...res.data]
          );
          setSentHasNext(newHasNext);
          setSentNextPage(newNextPage ? newNextPage : "");
        } else if (seg === "received") {
          setReceivedData((prev) =>
            currentNextPage ? mergeAndClean(prev, res.data) : [...res.data]
          );
          setReceivedHasNext(newHasNext);
          setReceivedNextPage(newNextPage ? newNextPage : "");
        }
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error loading friends, please try again later",
        });
      }
    },
    [
      user,
      friendsNextPage,
      sentNextPage,
      receivedNextPage,
      // 'searchValue' is not mandatory here, because we pass 'customSearch'
    ]
  );

  // ---------------------------
  // The infinite scroll approach
  // ---------------------------
  const handleEndReached = () => {
    if (segment === "friends" && friendsHasNext) {
      loadSegmentData("friends", searchValue);
    } else if (segment === "sent" && sentHasNext) {
      loadSegmentData("sent", searchValue);
    } else if (segment === "received" && receivedHasNext) {
      loadSegmentData("received", searchValue);
    }
  };

  // The data for the current tab
  let currentData: PlayerType[] = [];
  if (segment === "friends") currentData = friendsData;
  if (segment === "sent") currentData = sentData;
  if (segment === "received") currentData = receivedData;

  // ---------------------------
  // Searching
  // 1) We store in state
  // 2) Reset pagination
  // 3) Immediately call loadSegmentData with the new text
  // ---------------------------
  const searchByUsername = (text: string) => {
    setSearchValue(text);

    if (segment === "friends") {
      setFriendsData([]);
      setFriendsHasNext(false);
      setFriendsNextPage("");
      loadSegmentData("friends", text, "");
    } else if (segment === "sent") {
      setSentData([]);
      setSentHasNext(false);
      setSentNextPage("");
      loadSegmentData("sent", text, "");
    } else if (segment === "received") {
      setReceivedData([]);
      setReceivedHasNext(false);
      setReceivedNextPage("");
      loadSegmentData("received", text, "");
    }
  };

  // Segment Tabs
  const SegmentTabs = () => (
    <View className="flex-row justify-around items-center mb-4">
      {(["friends", "sent", "received"] as FriendSegment[]).map((seg) => {
        const isActive = seg === segment;
        return (
          <TouchableOpacity
            key={seg}
            onPress={() => setSegment(seg)}
            className={`py-2 px-4 rounded-full ${
              isActive ? "bg-[yellow]" : "bg-primary"
            } mx-1`}
          >
            <Text
              className={`${isActive ? "text-[#000000]" : "text-[#000000]"} font-bold`}
            >
              {seg === "friends" ? "Friends" : seg === "sent" ? "Sent" : "Received"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Friend actions
  const handleAddFriend = async (targetId: string) => {
    if (!user) return;
    try {
      const result = await createFriendship(user.id, targetId);
      if (result) {
        Toast.show({ type: "success", text1: "Friend Request Sent" });
        // If on 'sent' tab, you might want to refresh to see them
        setFriendsData(friendsData.filter(f=>f.id!==targetId))
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error sending friend request" });
    }
  };

  const handleUpdateFriendship = async (targetId: string) => {
    if (!user) return;
    try {
      const result = await updateFriendship(user.id, targetId);
      if (result) {
        Toast.show({ type: "success", text1: "Friend Request Updated" });
        // If accepted, remove from "received" list
        setReceivedData((prev) => prev.filter((p) => p.id !== targetId));
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error updating friend request" });
    }
  };

  const removeUserFriendship = (playerId: string, target: PlayerType) => {
    deleteFriendship(playerId, target.id);
    if (segment === "friends") {
      setFriendsData((prev) => prev.filter((p) => p.id !== target.id));
    } else if (segment === "sent") {
      setSentData((prev) => prev.filter((p) => p.id !== target.id));
    } else if (segment === "received") {
      setReceivedData((prev) => prev.filter((p) => p.id !== target.id));
    }
  };

  // Empty component
  const renderEmptyList = () => {
    if (segment === "friends") {
      return (
        <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
          <UserGroupIcon size={wp(20)} color="#000" />
          <Text style={{ marginTop: 10, color: "#4e2b00", fontWeight: "bold" }}>
            Search to add new friends!
          </Text>
        </View>
      );
    } else if (segment === "sent") {
      return (
        <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
          <UserGroupIcon size={wp(20)} color="#000" />
          <Text style={{ marginTop: 10, color: "#4e2b00", fontWeight: "bold" }}>
            No friend requests sent.
          </Text>
        </View>
      );
    } else {
      // 'received'
      return (
        <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
          <UserGroupIcon size={wp(20)} color="#000" />
          <Text style={{ marginTop: 10, color: "#4e2b00", fontWeight: "bold" }}>
            No incoming friend requests.
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ffc75f]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SegmentTabs />

        <View
          className="flex-row items-center bg-[#dfe0df] rounded-md mx-4 px-3 py-2 mb-4"
          style={{ minHeight: hp(8) }}
        >
          <MagnifyingGlassIcon size={wp(5)} color="#000000" />
          <TextInput
            placeholder="Search username or email"
            placeholderTextColor="#777"
            value={searchValue}
            onChangeText={searchByUsername}
            className="ml-2 flex-1 text-[#000000]"
            autoCapitalize="none"
          />
        </View>

        <FlatList
          data={currentData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          onEndReachedThreshold={0.5}
          onEndReached={handleEndReached}
          ListEmptyComponent={renderEmptyList}
          renderItem={({ item }) => (
            <FriendItem
              item={item}
              segment={segment}
              onAccept={() => handleUpdateFriendship(item.id)}
              onUnfriend={() => removeUserFriendship(user.id, item)}
              onAdd={() => handleAddFriend(item.id)}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FriendsScreen;
