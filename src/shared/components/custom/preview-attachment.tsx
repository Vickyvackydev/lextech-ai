import { LoaderIcon } from "./icons";
import { MdClose } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: any;
  isUploading?: boolean;
  onRemove?: () => void;
}) => {
  const { name, url, contentType } = attachment;

  // Check if the attachment is an image
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(contentType);

  return (
    <div className="flex flex-col gap-2 max-w-16">
      <div className="w-20 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {isImage ? (
          <img
            src={attachment}
            alt={"An image attachment"}
            className="rounded-md w-full h-full object-cover"
          />
        ) : (
          <div>
            <FaFilePdf size={30} color="red" />
          </div>
        )}

        {/* Show loader when uploading */}
        {isUploading && (
          <div className="animate-spin absolute text-zinc-500">
            <LoaderIcon />
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          aria-label="Remove attachment"
        >
          <MdClose size={16} className="text-black" />
        </button>
      </div>

      {/* Display file name */}
      {/* <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div> */}
    </div>
  );
};
