import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import WebsiteForm from "../components/WebsiteForm";

interface WebsiteFormData {
  businessName: string;
  tagline: string;
  businessDescription: string;
  designStyle: string;
  colorScheme: string;
  websiteSections: string[];
  contactEmail: string;
  phoneNumber: string;
  instagram: string;
  facebook: string;
}

const WebsiteEditor: React.FC = () => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      fromElement: true,
      height: "100vh",
      width: "auto",
      storageManager: false,
      panels: { defaults: [] },
    });

    editorRef.current = editor;
  }, []);

  const buildPromptFromForm = (formData: WebsiteFormData): string => {
    const {
      businessName,
      tagline,
      businessDescription,
      designStyle,
      colorScheme,
      websiteSections,
      contactEmail,
      phoneNumber,
      instagram,
      facebook,
    } = formData;

    return `
Create a website for a business named "${businessName}" with the tagline "${tagline}". 
Description: "${businessDescription}". 
Design style: ${designStyle}, Color scheme: ${colorScheme}.
Include sections: ${websiteSections.join(", ")}.
Contact: Email - ${contactEmail}, Phone - ${phoneNumber}, Instagram - ${instagram}, Facebook - ${facebook}.
Make the layout responsive, clean, and visually appealing.
    `.trim();
  };

  const handleFormSubmit = async (formData: WebsiteFormData) => {
    const prompt = buildPromptFromForm(formData);

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const htmlCode = data.html;
      const cssCode = data.css;

      if (editorRef.current) {
        editorRef.current.setComponents(htmlCode);
        editorRef.current.setStyle(cssCode);
      }
    } catch (err) {
      console.error("Error generating website:", err);
      alert("Something went wrong while generating the website.");
    }
  };

  
  return (
    <div>
      <div className="p-4 bg-white border-b shadow">
        <WebsiteForm onSubmit={handleFormSubmit} />
      </div>
      <div id="gjs" className="bg-white"></div>
    </div>
  );
};

export default WebsiteEditor;
