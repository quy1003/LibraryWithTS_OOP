import { useState, useEffect } from "react";
import { Category } from "./class/Category";

const CategoryComponent = () => {
  const [cateID, setCateID] = useState("");
  const [cateName, setCateName] = useState("");
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState<string | null>(null);

  useEffect(() => {
    // Lấy danh sách categories từ sessionStorage
    const storedCategories = sessionStorage.getItem("categories");

    if (storedCategories) {
      const categories = JSON.parse(storedCategories).map(
        (item: any) => new Category(item.id, item.categoryName)
      );
      setCategoriesList(categories);
    } else {
      // Nếu chưa có dữ liệu trong sessionStorage, khởi tạo với dữ liệu mặc định
      const defaultCategories = [
        new Category("1", "Tình cảm"),
        new Category("2", "Khoa học viễn tưởng"),
      ];

      // Lưu vào sessionStorage
      sessionStorage.setItem("categories", JSON.stringify(defaultCategories));

      // Cập nhật lại danh sách categories
      setCategoriesList(defaultCategories);
    }
  }, []);

  const submitCategory = () => {
    if (isEditing && editID) {
      const updatedCategories = categoriesList.map((category) => {
        if (category.getId === editID) {
          return new Category(editID, cateName);
        }
        return category;
      });

      sessionStorage.setItem("categories", JSON.stringify(updatedCategories));
      setCategoriesList(updatedCategories);
      resetForm();
    } else {
      if (cateID !== "" && cateName !== "") {
        const newCategory = new Category(cateID, cateName);
        const updatedCategories = [...categoriesList, newCategory];

        sessionStorage.setItem("categories", JSON.stringify(updatedCategories));
        setCategoriesList(updatedCategories);
        resetForm();
      } else {
        alert("Please fill out all of these fields!");
      }
    }
  };

  const editCategory = (category: Category) => {
    setCateID(category.getId);
    setCateName(category.getName);
    setIsEditing(true);
    setEditID(category.getId);
  };

  const resetForm = () => {
    setCateID("");
    setCateName("");
    setIsEditing(false);
    setEditID(null);
  };

  return (
    <>
      <h1 style={{ color: "orange", marginTop: "-100px", position:'relative' }}>Categories Management</h1>
      <a href="/books/" style={{position:'absolute', left: '10px', top:'10px'}}>Go to books page</a>
      <span>
        <p
          style={{
            marginTop: "-20px",
            textAlign: "center",
            backgroundColor: "lightyellow",
          }}
        >
          <i>*All of these fields must be included the value properly💡</i>
        </p>
      </span>
      <div>
        <input
          value={cateID}
          onChange={(t) => setCateID(t.target.value)}
          placeholder="Enter the category ID..."
          type="text"
          style={{ padding: "10px", width: "40%" }}
          disabled={isEditing}
        />
      </div>
      <div>
        <input
          value={cateName}
          onChange={(t) => setCateName(t.target.value)}
          placeholder="Enter the name of category..."
          type="text"
          style={{ padding: "10px", width: "40%", marginTop: "10px" }}
        />
      </div>
      <button
        onClick={submitCategory}
        style={{ marginTop: "10px", backgroundColor: "orange", color:'white' }}
      >
        {isEditing ? "Save Changes" : "Add New Category"}
      </button>
      <h2>List of categories</h2>
      {categoriesList.length > 0 ? (
        <ul style={{ listStyleType: "none" }}>
          {categoriesList.map((c) => (
            <li
              style={{
                padding: "5px",
                backgroundColor: "lightyellow",
                marginTop: "5px",
                position: "relative",
              }}
              key={c.getId}
            >
              {c.getName}
              <button
                onClick={() => editCategory(c)}
                style={{
                  right: "10px",
                  position: "absolute",
                  backgroundColor: "lightgreen",
                  height: "34px",
                  padding: "10px",
                  textAlign: "center",
                  top: "0",
                  bottom: "0",
                }}
              >
                ⚙️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nothing to show</p>
      )}
    </>
  );
};

export default CategoryComponent;
