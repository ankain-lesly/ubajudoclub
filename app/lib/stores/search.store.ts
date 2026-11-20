import { create } from "zustand";

export type SearchCategory = "all" | "techniques" | "belts" | "pages";

interface SearchState {
  isOpen: boolean;
  query: string;
  category: SearchCategory;
  openSearch: (initialCategory?: SearchCategory) => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuery: (query: string) => void;
  setCategory: (category: SearchCategory) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: "",
  category: "all",
  openSearch: (initialCategory) =>
    set({
      isOpen: true,
      category: initialCategory || "all",
    }),
  closeSearch: () => set({ isOpen: false, query: "" }),
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
}));
