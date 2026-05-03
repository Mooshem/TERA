import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { router } from "expo-router";

import { listenToEvents } from "../../src/services/eventService";
import { AppCard } from "@/src/ui/components/AppCard";
import { AppButton } from "@/src/ui/components/AppButton";
import { PixelNatureBackdrop } from "@/src/ui/components/PixelNatureBackdrop";
import { ui } from "@/src/ui/theme";
import { StyleSheet } from "react-native";

export default function Explore() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = listenToEvents(setEvents);
    return unsub;
  }, []);

  const filtered = events.filter((e) =>
    (e.createdByUsername || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <PixelNatureBackdrop />
      <Text style={styles.header}>Discover Community Cleanups</Text>
      <Text style={styles.subheader}>Find events, earn points, and restore your local environment.</Text>

      <TextInput
        placeholder="Search by organizer..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={ui.colors.textMuted}
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <AppCard>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyBody}>Try another organizer name or check back soon.</Text>
          </AppCard>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.gridCard}>
            {item.photoURL ? (
              <Image
                source={{ uri: item.photoURL }}
                style={styles.image}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No image</Text>
              </View>
            )}

            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title || "Cleanup Event"}
              </Text>

              <Text style={styles.meta} numberOfLines={1}>
                {item.location || "Unknown location"}
              </Text>
              <Text style={styles.meta}>
                🌱 {item.pointsReward || 0} pts • 👥 {item.attendees?.length || 0} going
              </Text>
              <Text style={styles.byline} numberOfLines={1}>
                by {item.createdByUsername || "Unknown"}
              </Text>

              <AppButton
                label="View"
                onPress={() => router.push(`/event/${item.id}`)}
                variant="secondary"
              />
            </View>
          </AppCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ui.spacing.md,
    backgroundColor: ui.colors.background,
  },
  search: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.md,
    paddingHorizontal: ui.spacing.md,
    paddingVertical: ui.spacing.sm,
    backgroundColor: ui.colors.surface,
    marginBottom: ui.spacing.md,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: ui.colors.text,
    marginBottom: 2,
  },
  subheader: {
    color: ui.colors.textMuted,
    marginBottom: ui.spacing.md,
  },
  columns: {
    gap: ui.spacing.md,
  },
  listContent: {
    gap: ui.spacing.md,
    paddingBottom: ui.spacing.xxl,
  },
  gridCard: {
    flex: 1,
    padding: 0,
    overflow: "hidden",
    backgroundColor: "rgba(247,251,247,0.94)",
  },
  image: {
    height: 120,
    width: "100%",
  },
  placeholder: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9efe9",
  },
  placeholderText: {
    color: ui.colors.textMuted,
  },
  content: {
    padding: ui.spacing.sm,
    gap: ui.spacing.xs,
  },
  title: {
    fontWeight: "700",
    color: ui.colors.primaryDark,
    minHeight: 36,
  },
  meta: {
    color: ui.colors.textMuted,
    fontSize: 12,
  },
  byline: {
    color: ui.colors.primaryDark,
    fontSize: 12,
    marginBottom: ui.spacing.sm,
  },
  emptyTitle: {
    fontWeight: "700",
    color: ui.colors.text,
    fontSize: ui.type.section,
  },
  emptyBody: {
    color: ui.colors.textMuted,
    marginTop: ui.spacing.xs,
  },
});