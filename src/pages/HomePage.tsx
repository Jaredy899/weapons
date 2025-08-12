import { useState, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { loadGunsFromCSV, Gun } from "../lib/guns"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [archiveSearchTerm, setArchiveSearchTerm] = useState("")
  const [viewingGun, setViewingGun] = useState<Gun | null>(null)
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null)
  const [guns, setGuns] = useState<Gun[]>([])

  useEffect(() => {
    const loadGuns = async () => {
      const loadedGuns = await loadGunsFromCSV()
      setGuns(loadedGuns)
    }
    loadGuns()
  }, [])

  // Filter guns based on isArchived flag
  const activeGuns = useMemo(() => 
    guns.filter(gun => gun.isArchived === false),
    [guns]
  )
  const archivedGuns = useMemo(() => 
    guns.filter(gun => gun.isArchived === true),
    [guns]
  )

  const filteredActiveGuns = useMemo(() => 
    activeGuns.filter((gun) =>
      gun.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gun.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gun.caliber.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [activeGuns, searchTerm]
  )

  const filteredArchivedGuns = useMemo(() => 
    archivedGuns.filter((gun) =>
      gun.manufacturer.toLowerCase().includes(archiveSearchTerm.toLowerCase()) ||
      gun.model.toLowerCase().includes(archiveSearchTerm.toLowerCase()) ||
      gun.caliber.toLowerCase().includes(archiveSearchTerm.toLowerCase())
    ),
    [archivedGuns, archiveSearchTerm]
  )

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Firearm Inventory</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track and manage your firearm collection</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="inventory" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Active Inventory</span>
              <span className="sm:hidden">Active</span>
              <span className="ml-1">({activeGuns.length})</span>
            </TabsTrigger>
            <TabsTrigger value="archive" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Sold/Traded</span>
              <span className="sm:hidden">Sold</span>
              <span className="ml-1">({archivedGuns.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Active Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Current Inventory</CardTitle>
                <CardDescription className="text-sm">Your active firearm collection</CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Search firearms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredActiveGuns.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground px-4">
                    {activeGuns.length === 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base">No firearms in your inventory yet.</p>
                        <p className="text-xs sm:text-sm">Add guns to the myGuns array in the code to get started.</p>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base">No firearms match your search criteria.</p>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="min-w-full inline-block align-middle">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Manufacturer</TableHead>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Model</TableHead>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">Caliber</TableHead>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">Serial Number</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredActiveGuns.map((gun) => (
                            <TableRow
                              key={`${gun.manufacturer}-${gun.model}-${gun.serialNumber}`}
                              className="cursor-pointer hover:bg-muted/50 active:bg-muted"
                              onClick={() => setViewingGun(gun)}
                            >
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 font-medium">
                                {gun.manufacturer}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4">
                                <div>
                                  <div>{gun.model}</div>
                                  <div className="text-xs text-muted-foreground sm:hidden">
                                    {gun.caliber}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                                {gun.caliber}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 font-mono hidden md:table-cell">
                                {gun.serialNumber}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Archive Tab */}
          <TabsContent value="archive">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Sold/Traded Firearms</CardTitle>
                <CardDescription className="text-sm">Firearms that have been sold or traded</CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Search sold/traded..."
                    value={archiveSearchTerm}
                    onChange={(e) => setArchiveSearchTerm(e.target.value)}
                    className="w-full text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredArchivedGuns.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground px-4">
                    <p className="text-sm sm:text-base">No sold/traded firearms yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="min-w-full inline-block align-middle">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Manufacturer</TableHead>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Model</TableHead>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">Caliber</TableHead>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden lg:table-cell">Serial Number</TableHead>
                            <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">Disposition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredArchivedGuns.map((gun) => (
                            <TableRow
                              key={`${gun.manufacturer}-${gun.model}-${gun.serialNumber}`}
                              className="cursor-pointer hover:bg-muted/50 active:bg-muted"
                              onClick={() => setViewingGun(gun)}
                            >
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 font-medium">
                                {gun.manufacturer}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4">
                                <div>
                                  <div>{gun.model}</div>
                                  <div className="text-xs text-muted-foreground sm:hidden">
                                    {gun.caliber}
                                  </div>
                                  <div className="text-xs text-muted-foreground md:hidden mt-1">
                                    {gun.archiveNotes}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                                {gun.caliber}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 font-mono hidden lg:table-cell">
                                {gun.serialNumber}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">
                                {gun.archiveNotes}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Gun Viewer Dialog */}
        <Dialog open={!!viewingGun} onOpenChange={(open) => !open && setViewingGun(null)}>
          <DialogContent className="bg-[hsl(var(--background))] max-w-[95vw] sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            {viewingGun && (
              <>
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl">
                    {viewingGun.manufacturer} {viewingGun.model}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    <span className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span>{viewingGun.caliber}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-xs sm:text-sm">Serial: {viewingGun.serialNumber}</span>
                    </span>
                  </DialogDescription>
                </DialogHeader>
                {viewingGun.imageUrl && (
                  <div className="flex justify-center py-3 sm:py-4">
                    <img
                      src={viewingGun.imageUrl}
                      alt={`${viewingGun.manufacturer} ${viewingGun.model}`}
                      className="max-w-full max-h-64 sm:max-h-80 md:max-h-96 object-contain rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setFullSizeImage(viewingGun.imageUrl || null)}
                    />
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Full Size Image Dialog */}
        <Dialog open={!!fullSizeImage} onOpenChange={(open) => !open && setFullSizeImage(null)}>
          <DialogContent className="bg-[hsl(var(--background))] max-w-[95vw] sm:max-w-4xl md:max-w-6xl p-0 overflow-hidden">
            {fullSizeImage && (
              <img
                src={fullSizeImage}
                alt="Full size firearm"
                className="w-full h-auto object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 