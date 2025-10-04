import { SVGProps } from "react"

declare module "lucide-react" {
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    strokeWidth?: string | number
  }
}