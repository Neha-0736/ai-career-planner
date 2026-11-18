
type Props = {
  title: string;
  items: any[];
};

export default function Card({ title, items }: Props) {
  // Check whether an item contains information worth displaying
  const hasContent = (item: any): boolean => {
    if (item === null || item === undefined) return false;

    if (typeof item === "string") return item.trim().length > 0;

    if (typeof item === "number") return true;

    if (Array.isArray(item)) {
      return item.some(hasContent);
    }

    if (typeof item === "object") {
      return Object.values(item).some(hasContent);
    }

    return false;
  };

  // Remove empty or invalid entries
  const validItems = Array.isArray(items)
    ? items.filter(hasContent)
    : [];

  // Display arrays such as topics and skills
  const renderList = (values: any[]) => (
    <ul className="list-disc pl-5 space-y-1 mt-1">
      {values.filter(hasContent).map((value, index) => (
        <li key={index}>
          {typeof value === "object"
            ? renderDetails(value)
            : String(value)}
        </li>
      ))}
    </ul>
  );

  // Display structured AI recommendations
  const renderDetails = (item: any): React.ReactNode => {
    if (typeof item === "string" || typeof item === "number") {
      return String(item);
    }

    if (!item || typeof item !== "object") return null;

    // Learning roadmap
    if (item.skill && item.level && item.duration) {
      return (
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 text-base">
              {item.skill}
            </h4>
            <p className="text-sm text-gray-600">
              {item.level} · {item.duration}
            </p>
          </div>

          {item.topics?.length > 0 && (
            <div>
              <p className="font-medium text-gray-800">Topics to learn</p>
              {renderList(item.topics)}
            </div>
          )}

          {item.activities?.length > 0 && (
            <div>
              <p className="font-medium text-gray-800">
                Practical activities
              </p>
              {renderList(item.activities)}
            </div>
          )}

          {item.outcome && (
            <div>
              <p className="font-medium text-gray-800">
                Expected outcome
              </p>
              <p className="text-gray-600 mt-1">{item.outcome}</p>
            </div>
          )}
        </div>
      );
    }

    // Projects
    if (item.name || item.project) {
      return (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">
            {item.name || item.project}
          </h4>

          {item.description && (
            <p className="text-gray-600">{item.description}</p>
          )}

          {item.skills?.length > 0 && (
            <p className="text-sm text-gray-600">
              <strong>Skills:</strong>{" "}
              {item.skills.join(", ")}
            </p>
          )}

          {item.difficulty && (
            <p className="text-sm text-gray-600">
              <strong>Difficulty:</strong> {item.difficulty}
            </p>
          )}
        </div>
      );
    }

    // Courses and tutorials
    if (item.course || item.tutorial) {
      return (
        <div>
          {item.skill && (
            <p className="font-medium text-gray-800">{item.skill}</p>
          )}
          <p className="text-gray-600">
            {item.course || item.tutorial}
          </p>
        </div>
      );
    }

    // Other structured recommendations
    return (
      <div className="space-y-1">
        {Object.entries(item).map(([key, value]) => {
          if (!hasContent(value)) return null;

          return (
            <p key={key} className="text-gray-700">
              <strong>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </strong>{" "}
              {Array.isArray(value)
                ? value.join(", ")
                : typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
            </p>
          );
        })}
      </div>
    );
  };

  // Do not render empty cards
  if (validItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      <h3 className="font-semibold mb-4 text-gray-900">
        {title}
      </h3>

      <div className="space-y-4">
        {validItems.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            {renderDetails(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
