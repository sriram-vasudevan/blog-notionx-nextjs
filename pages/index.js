import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NotionAPI } from "notion-client";
import { NotionRenderer, CollectionRow, Code } from "react-notion-x";
// import { useRouter } from "next/router";

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

export default function Home({ recordMap }) {
  return (
    <div suppressHydrationWarning>
      <Head>
        <title>Min with Notion</title>
        <meta name="description" content="Min with notion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ padding: "1rem" }}>
        <h2>Home</h2>
      </div>
      <NotionRenderer
        suppressHydrationWarning
        recordMap={recordMap}
        fullPage={false}
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
        showCollectionViewDropdown={true}
        // showTableOfContents={true}
        // previewImages={true}
      />
    </div>
  );
}

const notion = new NotionAPI();
export const getStaticProps = async () => {
  // const pageId = context.params.pageId;
  const pageId = "12ee34fde6824900a7cd367792703941";

  const recordMap = await notion.getPage(pageId);
  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  };
};

// export async function getStaticProps() {
//   const data = await fetch(
//     "https://notion-api.splitbee.io/v1/table/12ee34fde6824900a7cd367792703941",
//   ).then((res) => res.json());
//   return {
//     props: {
//       posts: data,
//     },
//   };
// }
