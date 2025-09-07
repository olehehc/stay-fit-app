import { useState, useRef } from "react";
import Image from "next/image";

import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";

export default function ImagePicker({ label, name, error }) {
  const [pickedImage, setPickedImage] = useState(null);
  const pickerRef = useRef();

  function handlePickClick() {
    pickerRef.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`w-full h-40 border rounded-md flex items-center justify-center overflow-hidden relative ${
            error ? "border-destructive" : ""
          }`}
        >
          {pickedImage ? (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
              className="object-cover object-center"
            />
          ) : (
            <span className=" text-sm text-gray-400">No image picked yet</span>
          )}
          <Input
            id={name}
            name={name}
            type="file"
            accept="image/png, image/jpeg"
            ref={pickerRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="flex flex-col justify-end">
          <Button type="button" onClick={handlePickClick} className="w-full">
            Pick an Image
          </Button>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
