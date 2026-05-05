import { useState } from "react";

let _favs: string[] = [];

export function useFavoritesStore() {
  const [favIds, setFavIds] = useState<string[]>([..._favs]);

  const toggle = (businessId: string) => {
    _favs = _favs.includes(businessId)
      ? _favs.filter(id => id !== businessId)
      : [..._favs, businessId];
    setFavIds([..._favs]);
  };

  return { favIds, toggle, isFav: (id: string) => favIds.includes(id) };
}
