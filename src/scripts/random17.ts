/* eslint-disable @typescript-eslint/no-unused-vars */
import { trimLowerCase } from '@infinityxyz/lib/utils';
import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { getDocIdHash } from '../utils/main';
import { TokenInfo } from '../types/main';
import { RANKINGS_COLL } from '../utils/constants';
import { pixelScoreDb } from '../utils/firestore';
import FirestoreBatchHandler from '../utils/firestoreBatchHandler';

const pixelScoreDbBatchHandler = new FirestoreBatchHandler(pixelScoreDb);
const ALL_SCORES_DIR = '/mnt/disks/additional-disk/all_scores';
const SPLIT_PREFIX = 'split_';
const CHAIN_ID = '1';
const SPLIT_COMPLETE_PREFIX = 'complete_';
const ALL_COLLECTIONS_FILE = '/mnt/disks/additional-disk/all_scores/all_collections.txt';

const collectionSet = new Set<string>();

async function main() {
  console.log('Collecting scores...');
  // await processAllSplits(ALL_SCORES_DIR);
  await processOneSplit(ALL_SCORES_DIR, 'allScores.csv');
}

async function processAllSplits(dirPath: string) {
  const splits = fs.readdirSync(dirPath).filter((file) => file.startsWith(SPLIT_PREFIX));
  for (const split of splits) {
    await processOneSplit(dirPath, split);
  }
}

async function processOneSplit(dirPath: string, split: string) {
  try {
    console.log('======================== Collecting split:' + split + '========================');
    const splitCompleteFile = path.join(dirPath, SPLIT_COMPLETE_PREFIX + split);
    if (fs.existsSync(splitCompleteFile)) {
      console.log('Split', split, 'already processed.');
      return;
    }

    const splitFile = path.join(dirPath, split);
    // const lines = fs.readFileSync(splitFile, 'utf8').split('\n');
    const rl = readline.createInterface({
      input: fs.createReadStream(splitFile, 'utf8'),
      crlfDelay: Infinity
    });

    let numLinesRead = 0;
    rl.on('line', (line) => {
      const [
        serialNum,
        uselessCol1,
        uselessCol2,
        uselessCol3,
        collectionAddress,
        tokenId,
        globalPixelScore,
        inCollectionPixelRank,
        uselessCol4,
        uselessCol5,
        imageUrl,
        globalPixelRankBucket
      ] = line.split(',');

      // to account for empty lines
      if (
        serialNum &&
        collectionAddress &&
        tokenId &&
        globalPixelScore &&
        inCollectionPixelRank &&
        imageUrl &&
        globalPixelRankBucket
      ) {
        ++numLinesRead;
        collectionSet.add(collectionAddress);
      }
    });

    // for (const line of lines) {
    //   const [
    //     serialNum,
    //     uselessCol1,
    //     uselessCol2,
    //     uselessCol3,
    //     collectionAddress,
    //     tokenId,
    //     globalPixelScore,
    //     inCollectionPixelRank,
    //     uselessCol4,
    //     uselessCol5,
    //     imageUrl,
    //     globalPixelRankBucket
    //   ] = line.split(',');

    //   // to account for empty lines
    //   if (
    //     serialNum &&
    //     collectionAddress &&
    //     tokenId &&
    //     globalPixelScore &&
    //     inCollectionPixelRank &&
    //     imageUrl &&
    //     globalPixelRankBucket
    //   ) {
    //     collectionSet.add(collectionAddress);
    //     // const docId = getDocIdHash({ chainId: CHAIN_ID, collectionAddress, tokenId });
    //     // const rankingDocRef = pixelScoreDb.collection(RANKINGS_COLL).doc(docId);
    //     // const tokenInfo: TokenInfo = {
    //     //   chainId: CHAIN_ID,
    //     //   collectionAddress: trimLowerCase(collectionAddress),
    //     //   tokenId,
    //     //   imageUrl,
    //     //   pixelScore: parseFloat(globalPixelScore),
    //     //   pixelRank: parseInt(serialNum) + 1,
    //     //   pixelRankBucket: parseInt(globalPixelRankBucket),
    //     //   inCollectionPixelRank: parseInt(inCollectionPixelRank)
    //     // };
    //     // pixelScoreDbBatchHandler.add(rankingDocRef, tokenInfo, { merge: true });
    //   }
    // }

    rl.on('close', () => {
      for (const collectionAddress of collectionSet) {
        fs.appendFileSync(ALL_COLLECTIONS_FILE, collectionAddress + '\n');
      }
    });
    // commit any remaining data
    // await pixelScoreDbBatchHandler.flush();
    // console.log('======================== Finished Collecting split:' + split + '======================== \n\n\n');
    // execSync(`touch ${splitCompleteFile}`);
  } catch (error) {
    console.error('Error processing split:', split, error);
  }
}

main();
