"use client";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { db, storage } from "@/configs/FirebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Download, Trash2, Info } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

function LogoList() {
  const { userDetail } = useContext(UserDetailContext);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Add these states for delete confirmation
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [logoToDelete, setLogoToDelete] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [logosPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (userDetail?.email) {
      fetchUserLogos();
    }
  }, [userDetail]);

  // Calculate total pages whenever logos array changes
  useEffect(() => {
    setTotalPages(Math.ceil(logos.length / logosPerPage));
    // Make sure current page is valid
    if (
      currentPage > Math.ceil(logos.length / logosPerPage) &&
      logos.length > 0
    ) {
      setCurrentPage(1);
    }
  }, [logos, logosPerPage]);

  const fetchUserLogos = async () => {
    setLoading(true);
    try {
      // Get metadata from Firestore
      const logosCollection = collection(
        db,
        "users",
        userDetail.email,
        "logos"
      );
      const querySnapshot = await getDocs(logosCollection);

      const logosData = [];

      // Process each logo document
      for (const doc of querySnapshot.docs) {
        const logoData = doc.data();
        const docId = doc.id;

        console.log(`Processing Firestore doc: ${docId}`);

        // Use the image URL directly from Firestore document
        if (logoData.image) {
          logosData.push({
            id: docId,
            imageUrl: logoData.image,
            title: logoData.title || "Untitled Logo",
            description: logoData.desc || "",
            timestamp: logoData.timestamp || "",
            ...logoData,
          });
        } else {
          console.warn(`No image URL found for document ${docId}`);

          // If no image URL in Firestore, try to construct one based on timestamp if available
          if (logoData.timestamp) {
            try {
              // Extract timestamp from ISO string (assuming it's stored that way)
              const date = new Date(logoData.timestamp);
              const timestamp = date.getTime().toString();
              const possiblePath = `users/${userDetail.email}/logos/${timestamp}`;
              const imageRef = ref(storage, possiblePath);

              // Try to get the URL
              const url = await getDownloadURL(imageRef);

              logosData.push({
                id: docId,
                imageUrl: url,
                title: logoData.title || "Untitled Logo",
                description: logoData.desc || "",
                timestamp: logoData.timestamp || "",
                ...logoData,
              });
            } catch (error) {
              console.error(
                `Couldn't find image for ${docId} using timestamp:`,
                error
              );

              // Still add the document without an image
              logosData.push({
                id: docId,
                title: logoData.title || "Untitled Logo",
                description: logoData.desc || "",
                timestamp: logoData.timestamp || "",
                ...logoData,
              });
            }
          } else {
            // No timestamp to work with, just add the document without an image
            logosData.push({
              id: docId,
              title: logoData.title || "Untitled Logo",
              description: logoData.desc || "",
              ...logoData,
            });
          }
        }
      }

      // Sort by timestamp (newest first)
      logosData.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return dateB - dateA;
      });

      setLogos(logosData);
    } catch (error) {
      console.error("Error fetching logos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (logo) => {
    try {
      const loadingToastId = toast.loading("Preparing your download...");

      const response = await fetch(logo.imageUrl, {
        mode: "cors", // Ensure CORS is enabled
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const blob = await response.blob();
      const filename = logo.title
        ? `${logo.title.replace(/\s+/g, "-")}.png`
        : `logo-${logo.id}.png`;

      const FileSaver = await import("file-saver");
      FileSaver.default(blob, filename);
      toast.dismiss(loadingToastId);
      setTimeout(() => {
        toast.success("Logo downloaded successfully!");
      }, 300);
    } catch (error) {
      console.error("Error downloading logo:", error);
      toast.dismiss();
      toast.error("Download failed", {
        description: "Failed to download the logo. Please try again later.",
      });
    }
  };

  const handleDelete = async (logo) => {
    setLogoToDelete(logo);
    setShowDeleteAlert(true);

    // If the details modal is open when deleting from there, close it
    if (showDetails && selectedLogo?.id === logo.id) {
      setShowDetails(false);
    }
  };

  const confirmDelete = async () => {
    try {
      if (userDetail?.email && logoToDelete?.id) {
        // 1. Delete from Firestore
        const logoRef = doc(
          db,
          "users",
          userDetail.email,
          "logos",
          logoToDelete.id
        );
        await deleteDoc(logoRef);

        // 2. Delete from Storage
        try {
          // First priority: Use storagePath if available (this will be available for newly created logos)
          if (logoToDelete.storagePath) {
            const imageRef = ref(storage, logoToDelete.storagePath);
            await deleteObject(imageRef);
            console.log(
              "Image deleted from Storage using storagePath property"
            );
          }
          // Second priority: Try using the timestamp-based path for older logos
          else if (logoToDelete.timestamp) {
            const date = new Date(logoToDelete.timestamp);
            const timestamp = date.getTime().toString();
            const storagePath = `users/${userDetail.email}/logos/${timestamp}`;
            const imageRef = ref(storage, storagePath);
            await deleteObject(imageRef);
            console.log(
              "Image deleted from Storage using timestamp-based path"
            );
          }
          // Last resort: Parse path from imageUrl if available
          else if (
            logoToDelete.imageUrl &&
            logoToDelete.imageUrl.includes("firebasestorage.googleapis.com")
          ) {
            const urlObj = new URL(logoToDelete.imageUrl);
            const pathMatch = urlObj.pathname.match(/\/o\/(.*?)(?:\?|$)/);

            if (pathMatch && pathMatch[1]) {
              const storagePath = decodeURIComponent(pathMatch[1]);
              const imageRef = ref(storage, storagePath);
              await deleteObject(imageRef);
              console.log("Image deleted from Storage using URL path");
            } else {
              console.log(
                "Could not extract path from URL, skipping storage deletion"
              );
            }
          }
          // Skip deletion if we can't determine the path correctly
          else {
            console.log(
              "No valid storage path found, skipping storage deletion"
            );
          }
        } catch (storageError) {
          console.error("Error deleting image from Storage:", storageError);
          // Continue with UI updates even if storage deletion fails
        }

        // 3. Update state
        setLogos(logos.filter((item) => item.id !== logoToDelete.id));
        setShowDeleteAlert(false);
        setLogoToDelete(null);
      } else {
        console.error(
          "Missing required data for deletion: user email or logo ID"
        );
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
    }
  };

  const handleLogoDetails = (logo) => {
    setSelectedLogo(logo);
    setShowDetails(true);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top of the logo list
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to top of the logo list
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the logo list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get current logos
  const getCurrentLogos = () => {
    const indexOfLastLogo = currentPage * logosPerPage;
    const indexOfFirstLogo = indexOfLastLogo - logosPerPage;
    return logos.slice(indexOfFirstLogo, indexOfLastLogo);
  };

  // Generate page numbers for shadcn pagination
  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5; // Maximum number of visible page numbers

    if (totalPages <= maxVisible) {
      // If we have fewer pages than our max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                goToPage(i);
              }}
              href="#"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always include first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              goToPage(1);
            }}
            href="#"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate start and end of page numbers to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                goToPage(i);
              }}
              href="#"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always include last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault();
                goToPage(totalPages);
              }}
              href="#"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      {logos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg">
          <Image src="/empty.svg" alt="No logos" width={200} height={200} />
          <p className="text-gray-500">
            No logos found. Create your first logo!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentLogos().map((logo) => (
              <div
                key={logo.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <div className="relative h-48 w-full bg-gray-50">
                  {logo.imageUrl ? (
                    <Image
                      src={logo.imageUrl}
                      alt={logo.title || "Logo"}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate flex-1">
                      {logo.title || "Untitled Logo"}
                    </h3>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => handleLogoDetails(logo)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-transparent"
                        title="View details"
                      >
                        <Info size={16} />
                      </Button>
                      {logo.imageUrl && (
                        <Button
                          onClick={() => handleDownload(logo)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-transparent"
                          title="Download"
                        >
                          <Download size={16} />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(logo)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-transparent"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {logo.timestamp && (
                    <p className="text-xs text-gray-500 mt-2">
                      Created {formatDistanceToNow(new Date(logo.timestamp))}{" "}
                      ago
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Shadcn Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        goToPreviousPage();
                      }}
                      href="#"
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        goToNextPage();
                      }}
                      href="#"
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              {/* Page Info */}
              <div className="text-center mt-2 mb-4 text-sm text-gray-500">
                Showing {(currentPage - 1) * logosPerPage + 1} to{" "}
                {Math.min(currentPage * logosPerPage, logos.length)} of{" "}
                {logos.length} logos
              </div>
            </div>
          )}
        </>
      )}

      {/* Logo Details Modal */}
      {showDetails && selectedLogo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {selectedLogo.title || "Logo Details"}
                </h3>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              <div className="relative h-64 w-full bg-gray-50 mb-4">
                {selectedLogo.imageUrl ? (
                  <Image
                    src={selectedLogo.imageUrl}
                    alt={selectedLogo.title || "Logo"}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              {selectedLogo.title && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-1">
                    Title
                  </h4>
                  <p>{selectedLogo.title}</p>
                </div>
              )}
              {selectedLogo.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-1">
                    Description
                  </h4>
                  <p>{selectedLogo.description}</p>
                </div>
              )}

              {selectedLogo.timestamp && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-1">
                    Created
                  </h4>
                  <p>{new Date(selectedLogo.timestamp).toLocaleString()}</p>
                </div>
              )}

              <div className="flex justify-center space-x-3 mt-6">
                {selectedLogo.imageUrl && (
                  <Button
                    onClick={() => handleDownload(selectedLogo)}
                    variant="default"
                    className="bg-brand-primary hover:bg-brand-secondary text-white"
                  >
                    <Download size={16} className="mr-2" /> Download
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(selectedLogo)}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              logo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {logoToDelete?.imageUrl && (
            <div className="my-4 relative h-32 w-full bg-gray-50 rounded">
              <Image
                src={logoToDelete.imageUrl}
                alt={logoToDelete.title || "Logo"}
                fill
                className="object-contain p-2"
              />
            </div>
          )}

          <p className="text-sm font-medium mb-4">
            {logoToDelete?.title || "Untitled Logo"}
          </p>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export const dynamic = "force-dynamic";
export default LogoList;
