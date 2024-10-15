import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2 } from 'lucide-react';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, category: '', unit: 'UN' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/products');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async () => {
    try {
      await axios.post('/api/products', newItem);
      setNewItem({ name: '', quantity: 1, category: '', unit: 'UN' });
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleItemDone = async (id, isDone) => {
    try {
      await axios.put(`/api/products/${id}`, { isDone: !isDone });
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className="bg-gray-600 min-h-screen p-8">
      <h1 className="text-white text-3xl mb-6">Lista de Compras</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Item"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="bg-gray-500 text-white p-2 rounded flex-grow"
        />
        <input
          type="number"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="bg-gray-500 text-white p-2 rounded w-20"
        />
        <select
          value={newItem.unit}
          onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          className="bg-gray-500 text-white p-2 rounded"
        >
          <option value="UN">UN</option>
          <option value="KG">KG</option>
          <option value="L">L</option>
        </select>
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="bg-gray-500 text-white p-2 rounded"
        >
          <option value="">Selecione</option>
          <option value="fruta">Fruta</option>
          <option value="padaria">Padaria</option>
          <option value="legume">Legume</option>
          <option value="bebida">Bebida</option>
          <option value="carne">Carne</option>
        </select>
        <button onClick={addItem} className="bg-purple-light text-white p-2 rounded">
          <PlusCircle />
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="bg-gray-500 mb-2 p-4 rounded flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={item.isDone}
                onChange={() => toggleItemDone(item._id, item.isDone)}
                className="mr-4"
              />
              <span className={item.isDone ? 'line-through' : ''}>
                {item.name} - {item.quantity} {item.unit}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded text-xs mr-4 bg-${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <button onClick={() => deleteItem(item._id)} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    fruta: 'pink',
    padaria: 'yellow',
    legume: 'green',
    bebida: 'blue',
    carne: 'orange'
  };
  return colors[category] || 'gray-200';
};

export default ShoppingList;