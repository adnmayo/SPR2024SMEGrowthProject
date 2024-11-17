// REDEPLOYING FIXING FATAL CRASH

"use client";
import { readAllEnterprises } from "@/actions/enterprises/readAllEnterprises";
import { getOrganisation } from "@/actions/organisations/readOrganisation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Enterprise } from "@/payload-types";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { SortDropdown } from "@/components/SortDropdown";



const DashboardPage = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [organisation, setOrganisation] = useState("");

  const [showEnterprise, setShowEnterprise] = useState<Enterprise>();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [hover, setHover] = useState('');

  const [nameSort, setNameSort] = useState<'asc' | 'desc' | undefined>(undefined);
  const [growthSort, setGrowthSort] = useState<'highest' | 'lowest' | undefined>(undefined);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  const getGrowthGrade = (growthPotential: number | undefined): string => {
    if (typeof growthPotential !== 'number') return "Not Available";
    if (growthPotential <= 20) return "Very Low";
    if (growthPotential <= 40) return "Low";
    if (growthPotential <= 60) return "Average";
    if (growthPotential <= 80) return "High";
    return "Very High";
  };

  const handleNameSort = (sort: 'asc' | 'desc' | undefined) => {
    setNameSort(sort);
  };
  
  const handleGrowthSort = (sort: 'highest' | 'lowest' | undefined) => {
    setGrowthSort(sort);
  };
  
  const handleGradeSelect = (grades: string[]) => {
    setSelectedGrades(grades);
  };

  const getSortedEnterprises = () => {
    let sorted = [...enterprises];
  
    // Name sorting remains the same
    if (nameSort) {
      sorted.sort((a, b) => {
        if (nameSort === "asc") {
          return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
      });
    }
  
    // Updated growth sorting with null safety
    if (growthSort) {
      sorted.sort((a, b) => {
        // Convert null/undefined to 0 for sorting
        const aGrowth = typeof a.growthPotential === 'number' ? a.growthPotential : 0;
        const bGrowth = typeof b.growthPotential === 'number' ? b.growthPotential : 0;
        
        return growthSort === "highest" ? bGrowth - aGrowth : aGrowth - bGrowth;
      });
    }
  
    // Updated grade filtering with null safety
    if (selectedGrades.length > 0) {
      sorted = sorted.filter((enterprise) => {
        const grade = getGrowthGrade(enterprise.growthPotential ?? undefined);
        return selectedGrades.includes(grade);
      });
    }
  
    return sorted;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enterprisesResp = await readAllEnterprises();
        const orgRes = await getOrganisation();

        if (!orgRes.success || !enterprisesResp.success) {
          console.error("Failed to fetch data.");
          return;
        }

        setOrganisation(orgRes.organisation.name);

        setEnterprises(enterprisesResp.enterprises);
      } catch (error) {
        console.error(error || "An error occurred");
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    setEnterprises((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{organisation} Dashboard</h1>
        <Button
          onClick={() =>
            toast.success("A Dashboard Report was saved to your device.")
          }
        >
          Save Report <DownloadIcon />
        </Button>
      </div>
      {enterprises.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="py-3 px-6">
                  <SortDropdown
                    title="HGBS INDENTIFIED"
                    type="name"
                    onNameSort={handleNameSort}
                  />
                </th>

                <th scope="col" className="py-3 px-6 text-center">
                  <SortDropdown
                    title="GROWTH"
                    type="growth"
                    onGrowthSort={handleGrowthSort}
                    onGradeSelect={handleGradeSelect}
                    selectedGrades={selectedGrades}
                  />
                </th>

                <th scope="col" className="py-3 px-6">
                  Number of Employees
                </th>

                <th scope="col" className="py-3 px-6">
                  Contacted
                </th>

                <th scope="col" className="py-3 px-6">
                  Connected
                </th>

                <th scope="col" className="py-3 px-6">
                  Engaged
                </th>

                <th scope="col" className="py-3 px-6">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedEnterprises().map((enterprise) => (
                <tr 
                  className="bg-white border-b" 
                  key={enterprise.id}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <div
                      className={`cursor-pointer ${hover === enterprise.id ? 'text-blue-500' : ''}`}
                      onClick={() => {
                        setShowEnterprise(enterprise);
                        setOpenDetailsDialog(true);
                      }}
                      onMouseEnter={() => setHover(enterprise.id)}
                      onMouseLeave={() => setHover('')}
                    >
                      {enterprise.name}
                    </div>
                  </th>
                  <td className="py-4 px-6 text-center">
                    {enterprise.growthPotential && ((
                      enterprise.growthPotential >= 0 && enterprise.growthPotential <= 20 && (
                    <Badge
                      variant="destructive"
                      style={{ color: "rgb(0, 0, 0)", borderRadius: "0.5rem", fontSize: "0.60rem" }}
                      className="h-7 w-24 px-3 py-1 inline-flex items-center font-normal justify-center gap-2 whitespace-nowrap rounded hover:bg-distructor/90"
                    >
                      Very Low
                    </Badge>                    
                    )) || (
                      enterprise.growthPotential > 20  && enterprise.growthPotential <= 40 && (
                    <Badge
                      variant="warning"
                      style={{ color: "rgb(0, 0, 0)", borderRadius: "0.5rem", fontSize: "0.60rem" }}
                      className="h-7 w-24 px-3 py-1 inline-flex items-center font-normal justify-center gap-2 whitespace-nowrap rounded font-semibold hover:bg-warning/90"
                    >
                      Low
                    </Badge>                    
                    )) || (
                      enterprise.growthPotential > 40  && enterprise.growthPotential <= 60 && (
                    <Badge
                      variant="highlight"
                      style={{ color: "rgb(0, 0, 0)", borderRadius: "0.5rem", fontSize: "0.60rem" }}
                      className="h-7 w-24 px-3 py-1 inline-flex items-center font-normal justify-center gap-2 whitespace-nowrap rounded font-semibold hover:bg-highlight/90"
                    >
                      Average
                    </Badge>                    
                    )) || (
                      enterprise.growthPotential > 60  && enterprise.growthPotential <= 80 && (
                    <Badge
                      variant="highlight2"
                      style={{ color: "rgb(0, 0, 0)", borderRadius: "0.5rem", fontSize: "0.60rem" }}
                      className="h-7 w-24 px-3 py-1 inline-flex items-center font-normal justify-center gap-2 whitespace-nowrap rounded font-semibold hover:bg-highlight2/90"
                    >
                      High
                    </Badge>                    
                    )) || (
                      enterprise.growthPotential > 80  && enterprise.growthPotential <= 100 && (
                    <Badge
                      variant="success"
                      style={{ color: "rgb(0, 0, 0)", borderRadius: "0.5rem", fontSize: "0.60rem" }}
                      className="h-7 w-24 px-3 py-1 inline-flex items-center font-normal justify-center gap-2 whitespace-nowrap rounded font-semibold hover:bg-success/90"
                    >
                      Very High
                    </Badge>                    
                    )))}
                  </td>
                  <td className="py-4 px-6">
                    {enterprise.numEmployees && enterprise.numEmployees}
                  </td>
                  <td className="py-4 px-6">
                    <Switch className="data-[state=checked]:bg-green-500" />
                  </td>
                  <td className="py-4 px-6">
                    <Switch className="data-[state=checked]:bg-green-500" />
                  </td>
                  <td className="py-4 px-6">
                    <Switch className="data-[state=checked]:bg-green-500" />
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(enterprise.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AlertDialog
            open={openDetailsDialog}
            onOpenChange={setOpenDetailsDialog}
          >
            <AlertDialogTrigger />
            <AlertDialogContent className="p-5">
              <AlertDialogCancel className="absolute top-2 right-2">
                <button
                  aria-label="Close"
                  className="text-gray-700 hover:text-gray-900"
                >
                  &#10005;
                </button>
              </AlertDialogCancel>
              <h1 className="text-3xl font-bold mb-4">
                {showEnterprise?.name} Enterprise Details
              </h1>

              <h4 className="text-2xl font-bold">
                {" "}
                Growth Potential: {showEnterprise?.growthPotential}%
              </h4>

              <div className="text-sm text-gray-700">
                <h3 className="text-2xl font-bold"> Description </h3>
                <p className="mb-5">
                  {" "}
                  {showEnterprise?.description || "Not given"}{" "}
                </p>

                <div className="mb-5">
                  <h3 className="text-2xl font-bold"> Identification </h3>
                  <p>
                    <strong>ABN:</strong> {showEnterprise?.abn}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    {showEnterprise?.website ? (
                      <a
                        href={showEnterprise?.website || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {showEnterprise?.website}
                      </a>
                    ) : (
                      "Not given"
                    )}
                  </p>
                </div>

                <div className="mb-5">
                  <h3 className="text-2xl font-bold"> Business Type </h3>
                  <p>
                    <strong>Industry Sector:</strong>{" "}
                    {showEnterprise?.industrySector || "Not given"}
                  </p>
                  <p>
                    <strong>SME:</strong>{" "}
                    {showEnterprise?.sme ? "Yes" : "No" || "Not given"}
                  </p>   
                </div>

                <div className="mb-5">
                  <h3 className="text-2xl font-bold"> Address </h3>
                  <p>
                    <strong>Suburb:</strong>{" "}
                    {showEnterprise?.suburb || "Not given"}
                  </p>
                  <p>
                    <strong>Post Code:</strong>{" "}
                    {showEnterprise?.postCode || "Not given"}
                  </p>
                </div>

                <p>
                  <strong>Number of Employees:</strong>{" "}
                  {showEnterprise?.numEmployees || "Not given"}
                </p>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default DashboardPage;
