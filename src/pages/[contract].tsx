import type { GetServerSideProps, NextPage } from "next";
import { NoSsr } from "@mui/material";
import { ethers } from "ethers";
import GamePage from "@/components/GamePage";

export type GameProps = {
  contract: string;
  notFound?: boolean;
};

const Game: NextPage<GameProps> = ({ contract, notFound = false }) => {
  return (
    <>
      {notFound ? (
        <div>Not Exists</div>
      ) : (
        <NoSsr>
          <GamePage contract={contract} />
        </NoSsr>
      )}
    </>
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

export default Game;
