import { Erc721Metadata, RefreshTokenErrorJson, RefreshTokenFlow, TokenStandard } from '@infinityxyz/lib/types/core';
export interface NftArray {
  data: Nft[];
  cursor: string;
  hasNextPage: boolean;
}

export interface ExternalNftArray {
  data: ExternalNft[];
  cursor: string;
  hasNextPage: boolean;
}

export interface ExternalNft extends Nft {
  isSupported: boolean;
}

export interface Nft {
  collectionAddress?: string;
  collectionSlug?: string;
  collectionName?: string;
  hasBlueCheck?: boolean;
  chainId: string;
  slug: string;
  tokenId: string;
  minter: string;
  mintedAt: number;
  mintTxHash: string;
  mintPrice: number;
  destroyedAt?: number;
  metadata: Erc721Metadata;
  numTraitTypes: number;
  updatedAt: number;
  tokenUri: string;
  rarityRank: number;
  rarityScore: number;
  image: NftImage;
  state?: NftStateDto;
  tokenStandard: TokenStandard;
  owner?: string;
  inCollectionPixelRank?: number;
  pixelRank?: number;
  pixelRankBucket?: number;
  pixelScore?: number;
}

export interface NftImage {
  url: string;
  originalUrl: string;
  updatedAt: number;
}

interface NftStateMetadataDto {
  step: RefreshTokenFlow;
  error?: RefreshTokenErrorJson;
}

export interface NftStateDto {
  metadata: NftStateMetadataDto;
}

export interface RankInfoArray {
  data: RankInfo[];
  cursor: string;
  hasNextPage: boolean;
}

export interface RankInfo {
  chainId: string;
  collectionAddress: string;
  imageUrl: string;
  inCollectionPixelRank?: number;
  pixelRank?: number;
  pixelRankBucket?: number;
  pixelScore?: number;
  tokenId: string;
}
