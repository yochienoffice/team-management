import Image from "next/image";
import Content from "@/public/assets/img/Content.png";
import { StoreConfig } from "@/app/api/StoreSettingsAPI/models";
import { getStoreSettings } from "@/app/api/StoreSettingsAPI/route";

async function getBusinessName(): Promise<{ businessName: string }> {
  const data: StoreConfig = await getStoreSettings();
  return {
    businessName: data != null && data.businessName ? data.businessName : "",
  };
}

export default async function Header() {
  const businessName = (await getBusinessName()).businessName;

  return (
    <header className="md:px-8 md:py-4 flex items-center">
      <div className="flex gap-4 items-center">
        <div className="relative w-16 h-16 md:w-32 md:h-32">
          <Image src={Content} alt="Company Logo" fill />
        </div>
        <div className="flex flex-col gap-1 md:gap-2">
          <h1 className="text-lg md:text-3xl font-semibold">{businessName}</h1>
          <h2 className="text-md font-normal">Restaurant</h2>
        </div>
      </div>
    </header>
  );
}
