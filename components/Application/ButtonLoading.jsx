import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
export function ButtonLoading({
  type,
  text,
  loading,
  onClick,
  className,
  ...props
}) {
  return (
    <Button
      size="sm"
      type={type}
      variant="outline"
      disabled={loading}
      onClick={onClick}
      className={cn("", className)}
      {...props}
    >
      {loading && <Spinner />}
      {text}
    </Button>
  );
}

export default ButtonLoading;
