import { Bio } from '../models/Bio';

export const bios: Bio[] = [];

export const createBio = (bioData: Bio) => {
  bios.push(bioData);
};

export const getAllBios = () => {
  return bios;
};

export const getBioByUsername = (username: string) => {
  return bios.find((bio) => bio.username === username);
};

export const updateBio = (username: string, updatedBio: Bio) => {
  const index = bios.findIndex((bio) => bio.username === username);
  if (index !== -1) {
    bios[index] = updatedBio;
  }
};

export const deleteBio = (username: string) => {
  const index = bios.findIndex((bio) => bio.username === username);
  if (index !== -1) {
    bios.splice(index, 1);
  }
};