import Head from "next/head";

import {
  getPageTitle,
  getAllPagesInSpace,
  getPageProperty,
} from "notion-utils";
import { NotionAPI } from "notion-client";
import { NotionRenderer, CollectionRow, Code } from "react-notion-x";
// import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Pdf = dynamic(() =>
  import("react-notion-x").then((notion) => notion.Pdf),
);

const Equation = dynamic(() =>
  import("react-notion-x").then((notion) => notion.Equation),
);

const Collection = dynamic(
  () => import("react-notion-x").then((notion) => notion.Collection),
  { ssr: false },
);

const Modal = dynamic(
  () => import("react-notion-x").then((notion) => notion.Modal),
  { ssr: false },
);

const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

const notion = new NotionAPI();

export const getStaticProps = async (context) => {
  const pageId = context.params.pageId;
  const recordMap = await notion.getPage(pageId);
  //   const collectionId = "1e6b81e0-2d86-4e18-aa50-1bb1ca01d582";
  //   const collectionViewId = "0109adb7-e494-4a4d-b30b-f4c5cc2963ba";
  //   const colectionData = await notion.getCollectionData(
  //     collectionId,
  //     collectionViewId,
  //   );
  //   const textContent = getTextContent()
  //   console.log("colectionData : ", colectionData);
  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const rootNotionPageId = "893157be6a9d4e348621ee90166cefca";
  const rootNotionSpaceId = "56e12f35-de5f-48cf-a8bc-5661a8bedc03";

  const pages = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion),
    {
      traverseCollections: false,
    },
  );

  const paths = Object.keys(pages).map((pageId) => `/${pageId}`);

  return {
    paths,
    fallback: true,
  };
}

export default function NotionPage({ recordMap }) {
  if (!recordMap) {
    return null;
  }

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;
  const title = getPageTitle(recordMap);
  const description = getPageProperty("Description", block, recordMap);
  console.log("description : ", description);

  return (
    <>
      <Head>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <title>{title}</title>
      </Head>
      <div style={{ maxWidth: "100vw", overflowX: "hidden" }}>
        <NotionRenderer
          recordMap={recordMap}
          fullPage={true}
          darkMode={false}
          components={{
            pageLink: ({
              href,
              as,
              passHref,
              prefetch,
              replace,
              scroll,
              shallow,
              locale,
              ...props
            }) => (
              <Link
                href={href}
                as={as}
                passHref={passHref}
                prefetch={prefetch}
                replace={replace}
                scroll={scroll}
                shallow={shallow}
                locale={locale}
              >
                <a {...props} />
              </Link>
            ),
            code: Code,
            collection: Collection,
            collectionRow: CollectionRow,
            modal: Modal,
            pdf: Pdf,
            equation: Equation,
          }}
        />
      </div>
    </>
  );
}
