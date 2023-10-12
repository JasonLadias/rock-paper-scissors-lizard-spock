import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { NoSsr } from "@mui/material";
import { ethers } from "ethers";
import Gamepage from "@/components/Gamepage";

export type GamePageProps = {
  contract: string;
  notFound?: boolean;
};

const GamePage: NextPage<GamePageProps> = ({ contract, notFound = false }) => {
  return (
    <>{notFound ? <div>Not Exists</div> : <NoSsr><Gamepage contract={contract}/></NoSsr>}</>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.contract !== "string") {
    return {
      props: {
        notFound: true,
      },
    };
  }

  const isAddress = ethers.isAddress(params.contract);

  if (!isAddress) {
    return {
      props: {
        notFound: true,
      },
    };
  }

  return {
    props: {
      contract: params.contract,
    },
  };
};

export default GamePage;
