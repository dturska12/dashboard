import { useContractPrePublishMetadata } from "../../hooks";
import { DeployableContractContractCellProps } from "../../types";
import { Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { BuiltinContractMap } from "constants/mappings";
import { Text } from "tw-components";

export const ContractDescriptionCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  const address = useAddress();

  const fullPublishMetadata = useContractPrePublishMetadata(value, address);

  const description =
    BuiltinContractMap[value as keyof typeof BuiltinContractMap]?.description;

  return (
    <Skeleton
      isLoaded={
        fullPublishMetadata.isSuccess ||
        !fullPublishMetadata.isFetching ||
        !!description
      }
    >
      <Text size="body.md" noOfLines={1}>
        {fullPublishMetadata.data?.latestPublishedContractMetadata
          ?.publishedMetadata.description ||
          description ||
          (!fullPublishMetadata.isFetching ? "First Version" : "None")}
      </Text>
    </Skeleton>
  );
};
