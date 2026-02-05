import React, { useState } from "react";

interface WebsiteFormProps {
  onSubmit: (data: GeneratedWebsiteData) => void;
}

interface FormState {
  businessName: string;
  tagline: string;
  description: string;
  designStyle: string;
  colorScheme: string;
  sections: {
    hero: boolean;
    about: boolean;
    services: boolean;
    testimonials: boolean;
    contact: boolean;
    gallery: boolean;
  };
  contactEmail: string;
  phone: string;
  instagram: string;
  facebook: string;
}

interface GeneratedWebsiteData {
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

const WebsiteForm: React.FC<WebsiteFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<FormState>({
    businessName: "",
    tagline: "",
    description: "",
    designStyle: "Modern & Clean",
    colorScheme: "Professional Blue",
    sections: {
      hero: true,
      about: true,
      services: true,
      testimonials: false,
      contact: true,
      gallery: false,
    },
    contactEmail: "",
    phone: "",
    instagram: "",
    facebook: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      sections: { ...prev.sections, [name]: checked },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const includedSections = (Object.entries(form.sections) as [keyof FormState["sections"], boolean][])
      .filter(([, value]) => value)
      .map(([key]) =>
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
      );

    try {
      await onSubmit({
        businessName: form.businessName,
        tagline: form.tagline,
        businessDescription: form.description,
        designStyle: form.designStyle,
        colorScheme: form.colorScheme,
        websiteSections: includedSections,
        contactEmail: form.contactEmail,
        phoneNumber: form.phone,
        instagram: form.instagram,
        facebook: form.facebook,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const designStyles = [
    { value: "Modern & Clean", icon: "✨", description: "Sleek and minimalist" },
    { value: "Classic & Professional", icon: "🏛️", description: "Timeless and corporate" },
    { value: "Creative & Bold", icon: "🎨", description: "Vibrant and artistic" },
    { value: "Elegant & Sophisticated", icon: "💎", description: "Luxurious and refined" }
  ];

  const colorSchemes = [
    { value: "Professional Blue", gradient: "from-blue-500 to-blue-700" },
    { value: "Nature Green", gradient: "from-green-500 to-emerald-600" },
    { value: "Creative Purple", gradient: "from-purple-500 to-violet-600" },
    { value: "Energetic Orange", gradient: "from-orange-500 to-amber-600" },
    { value: "Elegant Rose", gradient: "from-pink-500 to-rose-600" },
    { value: "Tech Dark", gradient: "from-gray-800 to-gray-900" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌟 Create Your Dream Website
          </h1>
          <p className="text-gray-600 text-lg">
            Fill in the details below and we'll generate a stunning website for your business
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Business Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              🏢 Business Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  placeholder="e.g., Sunny Side Café"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={form.tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  placeholder="e.g., Fresh coffee, fresh start"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 resize-none"
                placeholder="Describe your business, what you do, and what makes you special..."
                required
              />
            </div>
          </div>

          {/* Design Preferences */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              🎨 Design Preferences
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Design Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designStyles.map((style) => (
                  <div
                    key={style.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      form.designStyle === style.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setForm(prev => ({ ...prev, designStyle: style.value }))}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{style.value}</h3>
                        <p className="text-sm text-gray-600">{style.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Color Scheme
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorSchemes.map((scheme) => (
                  <div
                    key={scheme.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      form.colorScheme === scheme.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setForm(prev => ({ ...prev, colorScheme: scheme.value }))}
                  >
                    <div className={`w-full h-8 rounded mb-2 bg-gradient-to-r ${scheme.gradient}`}></div>
                    <p className="text-sm font-medium text-gray-900 text-center">{scheme.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Website Sections */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              📄 Website Sections
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(form.sections).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleSectionToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              📞 Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  placeholder="contact@yourbusiness.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  placeholder="@yourbusiness"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Page
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  placeholder="facebook.com/yourbusiness"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading || !form.businessName || !form.description}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Your Website...</span>
                </div>
              ) : (
                "🚀 Generate My Website"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebsiteForm;