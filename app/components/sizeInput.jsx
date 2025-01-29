export default function SizeInputField({ index, value, onChange }) {
    const sizeData = value || { size: "", quantity: "", sold: "" };
  
    return (
      <div className="flex gap-2">
        <input
          name={`size-${index}`}
          placeholder="Size"
          value={sizeData.size}
          onChange={(e) => onChange(index, 'size', e.target.value)}
          className="input-field"
        />
        <input
          name={`quantity-${index}`}
          placeholder="Quantity"
          value={sizeData.quantity}
          onChange={(e) => onChange(index, 'quantity', e.target.value)}
          className="input-field"
        />
        <input
          name={`sold-${index}`}
          placeholder="Sold"
          value={sizeData.sold}
          onChange={(e) => onChange(index, 'sold', e.target.value)}
          className="input-field"
        />
      </div>
    );
  }
  