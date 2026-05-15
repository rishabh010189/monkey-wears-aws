import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { errorResponse, successResponse } from '../../src/utils/response';
import { IProduct } from '../../src/interfaces/Products.interface';
import { getJsonFile } from '../../src/shared/file-service/fileRepository';
import { ITags } from '../../src/interfaces/Tags.interface';

const FILE_KEY = 'search/tags.json';
const PRODUCTS_FILE_KEY = 'products.json';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const origin = event.headers.origin;
  const query = event.queryStringParameters?.q;

  try {
    const tags = await getJsonFile<ITags[]>(FILE_KEY);
    const allProducts = await getJsonFile<IProduct[]>(PRODUCTS_FILE_KEY);
    const responseData: Set<string> = new Set();

    query?.split(' ').map((word: string) => {
      if (word) {
        const lemma = tags.find((t: ITags) =>
          t.forms.some((w: string) => w.toLowerCase() === word.toLowerCase()),
        )?.lemma;
        lemma && responseData.add(lemma);
      }
    });

    console.log('*** tags in query string: ***');
    console.log(responseData);

    type IRankedProduct = IProduct & { matches: number };

    const ranked: IRankedProduct[] = allProducts
      .map((p: IProduct) => {
        const matchingTags = p.tags.filter((t) => {
          return responseData.has(t);
        });

        console.log('**** Matching tags ****');
        console.log(matchingTags);

        return {
          ...p,
          matches: matchingTags.length,
        };
      })
      .sort((a: IRankedProduct, b: IRankedProduct) => b.matches - a.matches);

    const topList = ranked.filter((i) => i.matches > 0).slice(0, 3);

    return successResponse(topList, origin);
  } catch (err) {
    return errorResponse('Something went wrong', origin, 500);
  }
};
