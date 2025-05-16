import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import Cookies from "js-cookie";
import {
  XCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

function CreateProduct() {
  const vendorId = localStorage.getItem("sellerAuth");
  const parsedVendorId = JSON.parse(vendorId);
  const vendorIdValue = parsedVendorId?.id; // Extract vendor ID from parsed object
  // console.log("Vendor ID:", vendorIdValue);


  const [product, setProduct] = useState({
    name: "",
    description: "",
    mainCategoryId: null,
    subCategoryId: null,
  
    variants: [
      {
        sku: "",
        price: "",
        stock: "",
        height: "",
        weight:"",
        attributes: [
          { key: "color", value: "" },
          { key: "size", value: "" },
        ],
      },
    ],
    images: [[], []], // Array of arrays to store images for each variant
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("sellerToken"); 



  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/vendor/get-my-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/vendor/get-all-category`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Format main categories for React Select
      const formattedCategories = data.categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
        subCategories: cat.subCategories, // Keep for filtering
      }));

      console.log("Categories:", formattedCategories);

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // const fetchSubCategories = useCallback(
  //   async (categoryId) => {
  //     setLoading(true);
  //     if (!token || !categoryId) return;
  //     try {
  //       const { data } = await axios.get(
  //         `${import.meta.env.VITE_BASE_URL}/admin/get-all-sub-categories`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       setSubCategories(data.subCategories);
  //     } catch (error) {
  //       console.error("Error fetching subcategories:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [token]
  // );

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/all-vendors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVendors(data.vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchVendors();
    }
  }, [token, fetchVendors]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOption) => {
    setProduct((prev) => ({
      ...prev,
      mainCategoryId: selectedOption,
      subCategoryId: null,
    }));

    // Filter and format subcategories
    const subCats = selectedOption.subCategories.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));

    setSubCategories(subCats);
  };

  const handleSubCategoryChange = (selectedOption) => {
    setProduct((prev) => ({
      ...prev,
      subCategoryId: selectedOption,
    }));
  };

 

  // Handle variant changes
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index][field] = value;
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Handle attribute changes
  const handleAttributeChange = (variantIndex, attrIndex, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].attributes[attrIndex][field] = value;
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Add new variant
  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: "",
          price: "",
          stock: "",
           height: "",
        weight:"",
          attributes: [
            { key: "color", value: "" },
            { key: "size", value: "" },
          ],
        },
      ],
      images: [...prev.images, []], // Add empty array for new variant images
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    if (product.variants.length === 1) return; // Keep at least one variant

    const updatedVariants = [...product.variants];
    updatedVariants.splice(index, 1);

    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);

    setProduct((prev) => ({
      ...prev,
      variants: updatedVariants,
      images: updatedImages,
    }));
  };

  // Add attribute to variant
  const addAttribute = (variantIndex) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].attributes.push({ key: "", value: "" });
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Remove attribute from variant
  const removeAttribute = (variantIndex, attrIndex) => {
    if (product.variants[variantIndex].attributes.length === 1) return; // Keep at least one attribute

    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].attributes.splice(attrIndex, 1);
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Handle image upload for each variant
  const handleImageChange = (variantIndex, e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[variantIndex] = [...updatedImages[variantIndex], ...files];
      return { ...prev, images: updatedImages };
    });
  };

  // Remove image from variant
  const removeImage = (variantIndex, imageIndex) => {
    setProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[variantIndex].splice(imageIndex, 1);
      return { ...prev, images: updatedImages };
    });
  };

  const validateForm = () => {
    if (!product.name || product.name.length < 3) {
      alert("Product name must be at least 3 characters long");
      return false;
    }
    if (!product.description) {
      alert("Description is required");
      return false;
    }
    if (!product.mainCategoryId) {
      alert("Please select a main category");
      return false;
    }
    if (!product.subCategoryId) {
      alert("Please select a subcategory");
      return false;
    }
    // if (!product.vendorId) {
    //   alert("Please select a vendor");
    //   return false;
    // }

    // Validate variants
    for (let i = 0; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (!variant.sku) {
        alert(`SKU is required for variant ${i + 1}`);
        return false;
      }
      if (!variant.price || variant.price <= 0) {
        alert(`Price must be greater than 0 for variant ${i + 1}`);
        return false;
      }
      if (!variant.stock || variant.stock <= 0) {
        alert(`Stock must be greater than 0 for variant ${i + 1}`);
        return false;
      }
       if (!variant.height || variant.height <= 0) {
        alert(`Stock must be greater than 0 for variant ${i + 1}`);
        return false;
       }
       if (!variant.weight || variant.weight <= 0) {
        alert(`Stock must be greater than 0 for variant ${i + 1}`);
        return false;
      }

      // Validate attributes
      for (let j = 0; j < variant.attributes.length; j++) {
        const attr = variant.attributes[j];
        if (!attr.key || !attr.value) {
          alert(
            `Both key and value are required for all attributes in variant ${
              i + 1
            }`
          );
          return false;
        }
      }

      // // Check if variant has images
      // if (product.images[i].length === 0) {
      //   alert(`Please upload at least one image for variant ${i+1}`);
      //   return false;
      // }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("mainCategoryId", product.mainCategoryId.value);
      formData.append("subCategoryId", product.subCategoryId.value);
      formData.append("vendorId", vendorIdValue);

      // Add variants as JSON string
      formData.append("variants", JSON.stringify(product.variants));

      // Add images for each variant with proper naming
      product.images.forEach((variantImages, variantIndex) => {
        variantImages.forEach((image, imageIndex) => {
          formData.append(`images_${variantIndex}`, image);
        });
      });

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/vendor/add-product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product added successfully!");
      fetchProducts();

      // Reset form
      setProduct({
        name: "",
        description: "",
        mainCategoryId: null,
        subCategoryId: null,
       
        variants: [
          {
            sku: "",
            price: "",
            stock: "",
             height: "",
        weight:"",
            attributes: [
              { key: "color", value: "" },
              { key: "size", value: "" },
            ],
          },
        ],
        images: [[]],
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      alert(
        "Failed to add product. " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(
        "Failed to delete product: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "name", label: "Name", render: (row) => row.name },
    {
      key: "variants",
      label: "Variants",
      render: (row) => row.variants?.length || 0,
    },
    {
      key: "price",
      label: "Price Range",
      render: (row) => {
        if (!row.variants || row.variants.length === 0) return "N/A";
        const prices = row.variants.map((v) => parseFloat(v.price));
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max
          ? `$${min.toFixed(2)}`
          : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <div className="group relative" title="Product Details">
            <Link
              to={`/view-product-detail/${row.id}`}
              className="text-blue-500"
            >
              <button>
                <ViewfinderCircleIcon className="h-5 w-5 text-green-500 hover:text-green-600" />
              </button>
            </Link>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              View Details
            </span>
          </div>
          <div className="group relative" title="Edit">
            <Link to={`/edit-product/${row.id}`} className="text-blue-500">
              <button>
                <PlusCircleIcon className="h-5 w-5 text-blue-500 hover:text-blue-600" />
              </button>
            </Link>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Edit
            </span>
          </div>
          <div className="group relative" title="Delete">
            <button onClick={() => handleDelete(row.id)}>
              <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-600" />
            </button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Delete
            </span>
          </div>
        </div>
      ),
      width: "w-24",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 mt-10 px-4 items-center">
        {/* Product Form Card */}
        <div className="p-6 border border-gray-300 shadow-sm rounded-2xl w-full max-w-6xl bg-white">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add Product with Variants
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  name="name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={product.name}
                  onChange={handleProductChange}
                  placeholder="Enter Product Name"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category
                </label>
                <Select
                  options={categories}
                  value={product.mainCategoryId}
                  onChange={handleCategoryChange}
                  placeholder="Select Main Category"
                  className="text-sm"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                {product.mainCategoryId && (
                  <Select
                    options={subCategories}
                    value={product.subCategoryId}
                    onChange={handleSubCategoryChange}
                    placeholder="Select Subcategory"
                  />
                )}
              </div>

              {/* <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <Select
                  options={vendors.map((vendor) => ({
                    value: vendor.id,
                    label: vendor.name,
                  }))}
                  value={product.vendorId}
                  onChange={handleVendorChange}
                  placeholder="Select Vendor"
                  className="text-sm"
                />
              </div> */}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={product.description}
                  onChange={handleProductChange}
                  placeholder="Enter Product Description"
                  rows={4}
                />
              </div>
            </div>

            {/* Variants Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Product Variants
                </h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1 text-sm font-medium"
                >
                  <PlusCircleIcon className="h-4 w-4" /> Add Variant
                </button>
              </div>

              {product.variants.map((variant, variantIndex) => (
                <div
                  key={variantIndex}
                  className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-800">
                      Variant #{variantIndex + 1}
                    </h4>
                    {product.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1 text-sm font-medium"
                      >
                        <XCircleIcon className="h-4 w-4" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={variant.sku}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            "sku",
                            e.target.value
                          )
                        }
                        placeholder="SKU (e.g. TEE-RED-M)"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            "price",
                            e.target.value
                          )
                        }
                        placeholder="Price"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            "stock",
                            e.target.value
                          )
                        }
                        placeholder="Stock quantity"
                        required
                      />
                    </div>
                  </div>


                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="number"
                        step="0.01"
                        value={variant.height}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            "height",
                            e.target.value
                          )
                        }
                        placeholder="height"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type="number"
                        value={variant.weight}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            "weight",
                            e.target.value
                          )
                        }
                        placeholder="weight"
                        required
                      />
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-700">Attributes</h5>
                      <button
                        type="button"
                        onClick={() => addAttribute(variantIndex)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 text-xs font-medium"
                      >
                        <PlusCircleIcon className="h-4 w-4" /> Add Attribute
                      </button>
                    </div>

                    {variant.attributes.map((attr, attrIndex) => (
                      <div
                        key={attrIndex}
                        className="flex gap-2 items-center mb-2"
                      >
                        <input
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={attr.key}
                          onChange={(e) =>
                            handleAttributeChange(
                              variantIndex,
                              attrIndex,
                              "key",
                              e.target.value
                            )
                          }
                          placeholder="Key (e.g. color)"
                        />
                        <input
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={attr.value}
                          onChange={(e) =>
                            handleAttributeChange(
                              variantIndex,
                              attrIndex,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="Value (e.g. red)"
                        />
                        {variant.attributes.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeAttribute(variantIndex, attrIndex)
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Images for this variant */}
                  <div>
                    <div className="mb-2">
                      <h5 className="font-medium text-gray-700 mb-2">Images</h5>
                    </div>

                    <div className="mb-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageChange(variantIndex, e)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {/* Preview uploaded images */}
                    {product.images[variantIndex] &&
                      product.images[variantIndex].length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.images[variantIndex].map((img, imgIndex) => (
                            <div key={imgIndex} className="relative w-20 h-20">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`Preview ${imgIndex}`}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeImage(variantIndex, imgIndex)
                                }
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div className="w-full max-w-6xl shadow-lg rounded-lg bg-white border border-gray-200 mb-10">
          <h3 className="p-4 text-xl font-semibold border-b border-gray-200">
            Products
          </h3>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No products found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        {columns.map((col) => (
                          <td
                            key={`${product.id}-${col.key}`}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {col.render(product)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProduct;
