import Layout from "@/components/sites/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import BlurImage from "@/components/BlurImage";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/sites/Loader";
// import prisma from "@/lib/prisma";

import type { GetStaticPaths, GetStaticProps } from "next";
import type { _SiteData, Meta } from "@/types";
import type { ParsedUrlQuery } from "querystring";
import { placeholderBlurhash, toDateString } from "@/lib/utils";

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  stringifiedData: string;
}

export default function Index({ stringifiedData }: IndexProps) {
  const router = useRouter();
  if (router.isFallback) return <Loader />;

  const data = JSON.parse(stringifiedData) as _SiteData;

  const meta = {
    title: data.name,
    description: data.description,
    logo: "/logo.png",
    ogImage: data.image,
    ogUrl: data.customDomain
      ? data.customDomain
      : `https://${data.subdomain}.vercel.pub`,
  } as Meta;

  return (
    <Layout meta={meta} subdomain={data.subdomain ?? undefined}>
      <div className="w-full mb-20">
        <div className="flex flex-col justify-center items-center py-20">
          <BlurImage
            src="/empty-state.png"
            alt="No Posts"
            width={613}
            height={420}
            placeholder="blur"
            blurDataURL={placeholderBlurhash}
          />
          <p className="text-2xl font-cal text-gray-600">
            Last Built: ({new Date(data.updatedAt).toLocaleString()})
          </p>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error("No path parameters found");

  const data: _SiteData = {
    name: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    subdomain: params.site,
    customDomain: "",
    image: "",
    imageBlurhash: "",
    user: {
      name: "test",
      image: "",
      email: "",
      createdAt: new Date(),
      emailVerified: new Date(),
      updatedAt: new Date(),
      gh_username: "test",
      id: "1",
      username: "test",
    },
    font: "font-cal",
    posts: [],
    id: "1",
    logo: null,
    userId: null,
  };

  return {
    props: {
      stringifiedData: JSON.stringify(data),
    },
    revalidate: 10,
  };
};
