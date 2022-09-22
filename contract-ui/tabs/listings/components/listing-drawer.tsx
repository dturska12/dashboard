import { CancelTab } from "./cancel-tab";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  chakra,
  usePrevious,
} from "@chakra-ui/react";
import { ThirdwebNftMedia, useAddress } from "@thirdweb-dev/react";
import { AuctionListing, DirectListing } from "@thirdweb-dev/sdk";
import { Marketplace } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/marketplace";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { Card, Drawer, Heading, Text } from "tw-components";

interface NFTDrawerProps {
  contract: Marketplace;
  isOpen: boolean;
  onClose: () => void;
  data: AuctionListing | DirectListing | null;
}

const ChakraThirdwebNftMedia = chakra(ThirdwebNftMedia);

export const ListingDrawer: React.FC<NFTDrawerProps> = ({
  isOpen,
  onClose,
  data,
  contract,
}) => {
  const address = useAddress();
  const prevData = usePrevious(data);

  const renderData = data || prevData;
  const isOwner = address === renderData?.sellerAddress;

  const tokenId = renderData?.asset.id.toString() || "";

  const tabs = useMemo(() => {
    if (!renderData) {
      return [];
    }
    const t = [
      {
        title: "Details",
        isDisabled: false,
        children: () => (
          <Card as={Flex} flexDir="column" gap={3}>
            <Text size="label.md">Token ID: {tokenId}</Text>
            <Text size="label.md">Owner: {renderData.sellerAddress}</Text>
            <Text size="label.md">Token Standard: {renderData.type}</Text>
            <Text size="label.md">
              Quantity: {BigNumber.from(renderData.quantity || "0").toString()}
            </Text>
          </Card>
        ),
      },
      {
        title: "Cancel Listing",
        isDisabled: !isOwner,
        children: () => (
          <CancelTab
            contract={contract}
            listingId={renderData.id}
            listingType={renderData.type}
          />
        ),
      },
    ];

    return t;
  }, [contract, isOwner, renderData, tokenId]);

  if (!renderData) {
    return null;
  }

  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="xl"
      onClose={onClose}
      isOpen={isOpen}
    >
      <Flex py={6} px={2} flexDir="column" gap={6}>
        <Flex gap={6}>
          <ChakraThirdwebNftMedia
            metadata={renderData.asset}
            requireInteraction
            flexShrink={0}
            boxSize={32}
            objectFit="contain"
          />
          <Flex flexDir="column" gap={2} w="70%">
            <Heading size="title.lg">{renderData.asset.name}</Heading>
            <Text size="label.md" noOfLines={6}>
              {renderData.asset.description}
            </Text>
          </Flex>
        </Flex>

        <Tabs isLazy lazyBehavior="keepMounted">
          <TabList
            px={0}
            borderBottomColor="borderColor"
            borderBottomWidth="1px"
            overflowX={{ base: "auto", md: "inherit" }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.title} gap={2} isDisabled={tab.isDisabled}>
                {tab.title}
              </Tab>
            ))}
          </TabList>
          <TabPanels px={0} py={2}>
            {tabs.map((tab) => {
              return (
                <TabPanel key={tab.title} px={0}>
                  {tab.children()}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Flex>
    </Drawer>
  );
};