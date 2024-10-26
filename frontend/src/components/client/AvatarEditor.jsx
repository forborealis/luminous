import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import AvatarEditor from 'react-avatar-editor';

const AvatarEditorComponent = forwardRef((props, ref) => {
  const [image, setImage] = useState(null);
  const editorRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useImperativeHandle(ref, () => ({
    getCroppedImage() {
      if (editorRef.current) {
        return editorRef.current.getImageScaledToCanvas().toDataURL();
      }
      return null;
    }
  }));

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {image && (
        <AvatarEditor
          ref={editorRef}
          image={image}
          width={150}
          height={150}
          border={50}
          borderRadius={75}
          scale={1.2}
        />
      )}
    </div>
  );
});

export default AvatarEditorComponent;