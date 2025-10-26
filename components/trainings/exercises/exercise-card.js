import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExerciseCard({
  title,
  exerciseType,
  muscleGroup,
  instructions,
  image,
}) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Exercise Type</Label>
              <Input name="exerciseType" defaultValue={exerciseType} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Muscle Group</Label>
              <Input name="muscleGroup" defaultValue={muscleGroup} readOnly />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              className="max-h-[25vh]"
              defaultValue={instructions}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Image</Label>
            <div className="relative w-full h-60 rounded-md overflow-hidden">
              <Image
                src={image}
                alt={`${title} blurred`}
                fill
                className="object-cover blur-xl scale-110 brightness-75"
              />
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
