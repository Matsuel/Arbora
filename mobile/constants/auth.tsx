import Apple from "@/components/icon/Apple";
import Google from "@/components/icon/Google";
import { googleController } from "@/lib/auth";

interface authConfigProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
}

const { handlePress } = googleController;

export const authConfig: authConfigProps[] = [
    {
        icon: <Google width={16} height={16} />,
        label: "Google",
        onPress: async () => await handlePress(),
    },
    {
        icon: <Apple width={16} height={16} />,
        label: "Apple",
        onPress: async () => {},
    }
    
]