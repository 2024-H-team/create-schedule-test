// googleMapConfig.ts
type Library = 'places' | 'directions' | 'geometry' | 'drawing' | 'visualization';

export const getGoogleMapLibraries = (additionalLibraries: Library[] = []): Library[] => {
    const defaultLibraries: Library[] = ['places'];
    return Array.from(new Set([...defaultLibraries, ...additionalLibraries]));
};
