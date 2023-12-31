import { Text, Box, Center, Image, Flex } from "@chakra-ui/react";

interface MenuItemProps {
  label: string;
  imageUrl: string;
  onClick: () => void;
  index: number
  selectedIndex: number
}

const MenuItem: React.FC<MenuItemProps> = ({ label, imageUrl, index, selectedIndex, onClick }) => {
  const isSelected = index === selectedIndex;
  return (
    <Box
      p={3}
      style={{
        cursor: 'pointer'
      }}
      bg={isSelected ? 'primary.blue2' : 'transparent'} // Green background for selected item
      _hover={{ bg: 'primary.blue3' }} // Different background color on hover
      onClick={onClick}
    >
      <Flex marginLeft={5}>
        <Center>
          <Center width={7} marginRight={3}>
            <Image src={imageUrl} />
          </Center>
          <Text fontSize='15' color={isSelected ? 'primary.green' : 'inherit'}>
            {label}
          </Text>
        </Center>
      </Flex>
    </Box >
  );
}

interface MenuProps {
  currentMenuIndex: number;
  setCurrentMenuIndex: React.Dispatch<React.SetStateAction<number>>;
}

const UserProfileMenu: React.FC<MenuProps> =
  ({ currentMenuIndex, setCurrentMenuIndex }) => {
    return (
      <Box width='20vw' height={'100vh'} pb={10} pt={10} mt={10} bg='primary.blue3' position='fixed'>
        < MenuItem
          index={0}
          selectedIndex={currentMenuIndex}
          label='Personal Information'
          imageUrl='src\assets\images\personal_info.png'
          onClick={() => { setCurrentMenuIndex(0) }} />
        < MenuItem
          index={1}
          selectedIndex={currentMenuIndex}
          label='Security'
          imageUrl='src\assets\images\security.png'
          onClick={() => { setCurrentMenuIndex(1) }} />
      </Box >
    );
  }

export default UserProfileMenu;
