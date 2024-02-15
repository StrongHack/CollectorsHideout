/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PublicationsService } from "../../../services/publicationsService";
import { UploadService } from "../../../services/uploadService";
import { PublicationType } from "../../../types";
import { Link } from "@nextui-org/react";

export default function Home() {
  const router = useRouter();
  const [publication, setPublication] = useState<PublicationType | null>(null);
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>();

  /**
   * Handles click in image
   *
   * @param image clicked
   */
  const handleClick = (image: string) => {
    try {
      setSelectedImage(image);
    } catch (error) {
      setSelectedImage("/default.png");
    }
  };

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        if (router.query.id) {
          PublicationsService.getPublication(router.query.id as string).then(
            (publicationData) => {
              setPublication(publicationData);

              try {
                UploadService.getImages(publicationData.images).then(
                  (images) => {
                    setImagesPaths(images);
                  }
                );
              } catch (error) {
                setImagesPaths([]);
              }
            }
          );
        }
      } catch (error) {
        console.error("Error fetching publication data:", error);
      }
    };
    fetchPublication();
  }, [router.query.id]);

  useEffect(() => {
    if (imagesPaths.length > 0) {
      setSelectedImage(imagesPaths[0]);
    } else {
      setSelectedImage("/default.png");
    }
  }, [imagesPaths]);

  return (
    <section className="bg-white py-10">
      <div className="container max-w-screen-xl mx-auto px-4 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-5">
          <aside>
            <div className="container max-w-screen-xl mx-auto p-2 rounded-lg flex justify-center items-center">
              <img
                className="w-[600px] h-[500px] object-cover inline-block container max-w-screen-xl mx-auto p-2 border border-gray-500 border-2 rounded-lg flex justify-center items-center"
                src={`${selectedImage}`}
                alt="Product title"
                width="400"
                height="340"
              />
            </div>
            {imagesPaths.length > 1 && (
              <div className="space-x-2 overflow-auto text-center whitespace-nowrap">
                {imagesPaths.map((image, index) => (
                  <Link
                    key={index}
                    className={`inline-block max-w-screen-xl mx-auto border border-gray-500 border-2 rounded-lg p-2 hover:border-blue-500 cursor-pointer ${
                      selectedImage === image ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleClick(image)}
                  >
                    <img
                      className="w-14 h-14 container thumbnail-image"
                      src={`${image}`}
                      alt={`Product image ${index + 1}`}
                      width="500"
                      height="500"
                    />
                  </Link>
                ))}
              </div>
            )}
          </aside>
          <main>
            <h2 className="font-bold text-3xl mb-4 text-black">
              {publication?.title}
            </h2>
            <p className="mb-4 font-semibold text-xl text-black">
              {publication?.type}
            </p>
            <p className="mb-7 text-zinc-500 text-justify text-sm">
              {publication?.description}
            </p>
            <div className="flex flex-col">
              <ul>
                <li className="flex items-center">
                  <b className="font-medium w-36 inline-block text-black">
                    State:
                  </b>
                  <b className="text-zinc-500 ml-[-90px]">
                    {publication?.state}
                  </b>
                </li>
              </ul>
              {publication?.type !== "Display" && (
                <>
                  <ul className="mb-5">
                    <li className="mb-1 flex items-center">
                      <b className="font-medium w-36 inline-block text-black">
                        Price:
                      </b>
                      <b className="text-zinc-500 ml-[-90px]">
                        {publication?.price} €
                      </b>
                    </li>
                  </ul>
                  <div className="flex-1 flex flex-wrap gap-2 mb-5">
                    <Link
                      className="bg-gray-700 text-white hover:bg-gray-600 px-2 py-2 inline-block border border-transparent rounded-md w-1/5 h-3/5"
                      href="/404"
                    >
                      <button className="">
                        <i className="fa fa-shopping-cart mr-2"></i>
                        Add to cart
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
