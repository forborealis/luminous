import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';

const AvatarEditorComponent = ({ setAvatar }) => {
  const [image, setImage] = useState(null);
  const editorRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      setAvatar(canvas);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {image && (
        <div>
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={150}
            height={150}
            border={50}
            borderRadius={75}
            scale={1.2}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default AvatarEditorComponent;