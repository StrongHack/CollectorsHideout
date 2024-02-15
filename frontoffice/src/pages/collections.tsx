/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import CollectionsFilter from "../../components/collectionsFilter";
import { CollectableType } from "../../types";
import { CollectablesService } from "../../services/collectablesService";
import { Divider, Link } from "@nextui-org/react";
import CollectableCard from "../../components/collectableCard";

export default function Collections() {
  const [collections, setCollections] = useState<string[]>([]);
  const [collectables, setCollectables] = useState<CollectableType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Fetches collectables and filters collections for collectables
   */
  const fetchCollectables = async () => {
    try {
      const collectables = await CollectablesService.getCollectables();

      let collections: string[] = [];

      for (const collectable of collectables) {
        if (!collections.includes(collectable.collectionId)) {
          collections.push(collectable.collectionId);
        }
      }

      setCollections(collections);
      setCollectables(collectables);
    } catch (error) {
      console.error(error);
      setCollections([]);
      setCollectables([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchCollectables();
  }, []);

  if(isLoading) {
    return (<div className="min-h-screen bg-white"></div>);
  }

  if (!collectables || collectables.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <img
            src="/images/refresh.png"
            alt="Refresh Icon"
            className="mx-auto mb-"
          />
          <Link href="/" className="text-blue-500 underline block mb-4">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-full min-h-screen bg-gray-200">
      {/* CollectionsFilter component */}
      <div className="flex-1 w-[25%] mb-6">
        <CollectionsFilter />
      </div>

      {/* List of collections */}
      <div className="bg-black w-[75%] bg-gray-200">
        {collections.map((collection) => (
          <div key={collection} className="mt-3">
            <label className="mx-2 text-black text-bold text-3xl">
              {collection}
            </label>
            <div className="w-full mx-auto mt-2 flex flex-wrap">
              {collectables
                .filter(
                  (collectable: CollectableType) =>
                    collectable.collectionId === collection
                )
                .map((collectable: CollectableType) => (
                  <CollectableCard collectable={collectable} />
                ))}
            </div>
            <Divider className="w-[98%] my-4 mx-auto" />
          </div>
        ))}
      </div>
    </main>
  );
}
