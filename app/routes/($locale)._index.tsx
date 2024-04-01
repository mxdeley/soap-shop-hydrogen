import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  type MetaFunction,
  FetcherWithComponents,
} from '@remix-run/react';
import {Suspense} from 'react';
import {CartForm, Image, Money, VariantSelector} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  ProductFragment,
  ProductVariantFragment,
  ProductVariantsQuery,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {Hero} from '~/components/Hero';
import {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {ShoppingBagIcon} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [{title: 'Soap Store'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="w-full">
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

// function FeaturedCollection({
//   collection,
// }: {
//   collection: FeaturedCollectionFragment;
// }) {
//   if (!collection) return null;
//   const image = collection?.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <>
      <Hero />
      <div className="p-12">
        <h2 className="text-3xl py-4 font-bold">Featured Products</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({products}) => (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
                {products.nodes.map((product) => (
                  <div key={product.id} className="relative bg-white">
                    <Link to={`/products/${product.handle}`} className="block">
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                        className="rounded-lg"
                      />
                    </Link>
                    {/* <div className="absolute bottom-12 right-0 p-2">
                      <ProductMain
                        selectedVariant={selectedVariant}
                        product={prod}
                        variants={variants}
                      />
                    </div> */}
                    <div className="flex items-center justify-center gap-x-4">
                      <div>
                        {' '}
                        <h4 className="text-black text-center pt-2">
                          {product.title}
                        </h4>
                        <h4 className="text-black text-center text-sm">
                          <Money data={product.priceRange.minVariantPrice} />
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    </>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
