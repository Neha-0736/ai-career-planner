
type Props = {
  title: string;
  items: any[];
};

export default function Card({ title, items }: Props) {
  const formatItem = (item: any): string | null => {
    if (!item) return null;

    if (typeof item === "string") {
      return item;
    }

    if (typeof item !== "object") {
      return String(item);
    }

    if (item.skill && item.level && item.duration) {
      return `${item.skill} - ${item.level} - ${item.duration}`;
    }

    if (item.skill && item.course) {
      return `${item.skill}: ${item.course}`;
    }

    if (item.skill && item.tutorial) {
      return `${item.skill}: ${item.tutorial}`;
    }

    if (item.skill && item.project) {
      return `${item.skill}: ${item.project}`;
    }

    if (item.tool) {
      return String(item.tool);
    }

    return null;
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      <h3 className="font-semibold mb-3">{title}</h3>

      {Array.isArray(items) && items.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, index) => {
            const text = formatItem(item);

            if (!text) return null;

            return <li key={index}>{text}</li>;
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No information available.</p>
      )}
    </div>
  );
}
