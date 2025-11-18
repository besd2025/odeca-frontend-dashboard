import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewImageDialog from "@/components/ui/view-image-dialog";

const products = [
  {
    id: 101,
    date: "12/8/2025",
    sdl_ct_type: "SDL",
    sdl_ct_name: "Ngome",
    No_fiche: 59.99,
    No_recus: 4.5,
    ca: 452,
    cb: 52,
    fiche_photo: "/images/logo_1.jpg",
  },
  {
    id: 102,
    date: "12/8/2025",
    sdl_ct_type: "SDL",
    sdl_ct_name: "Ngome",
    No_fiche: 59.99,
    No_recus: 4.5,
    ca: 452,
    cb: 52,
    fiche_photo: "/images/logo_1.jpg",
  },
];

export default function EditHistory() {
  return (
    <div className="w-full">
      <div className="w-full border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">ID</TableHead>
              <TableHead>Date d'achat</TableHead>
              <TableHead>SDL/CT</TableHead>
              <TableHead>No Fiche</TableHead>
              <TableHead>No Recus</TableHead>
              <TableHead>CA</TableHead>
              <TableHead>CB</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="odd:bg-muted/50">
                <TableCell className="pl-4">{product.id}</TableCell>
                <TableCell className="font-medium">{product.date}</TableCell>
                <TableCell>
                  {product.sdl_ct_type} {product.sdl_ct_name}
                </TableCell>
                <TableCell>{product.No_fiche}</TableCell>
                <TableCell>{product.No_recus}</TableCell>
                <TableCell>{product.ca}</TableCell>
                <TableCell>{product.cb}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
