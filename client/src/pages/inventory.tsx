import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertInventorySchema, type Inventory } from "@shared/schema";
import { Package, Plus, AlertTriangle, Calendar as CalendarIcon, TrendingDown, TrendingUp, Search } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const extendedInventorySchema = insertInventorySchema.extend({
  currentStock: z.number().min(0),
  minStockLevel: z.number().min(0),
  costPerUnit: z.number().min(0),
  expiryDate: z.date().optional(),
});

export default function Inventory() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [showAddItem, setShowAddItem] = useState(false);
  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: inventory, isLoading } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: lowStockItems } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory/low-stock"],
  });

  const { data: expiringItems } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory/expiring"],
  });

  const addItemMutation = useMutation({
    mutationFn: (data: z.infer<typeof extendedInventorySchema>) =>
      apiRequest("POST", "/api/inventory", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/expiring"] });
      toast({ title: "Inventory item added successfully" });
      setShowAddItem(false);
      addForm.reset();
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Inventory> }) =>
      apiRequest("PUT", `/api/inventory/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/low-stock"] });
      toast({ title: "Stock updated successfully" });
      setShowUpdateStock(false);
      setSelectedItem(null);
    },
  });

  const addForm = useForm<z.infer<typeof extendedInventorySchema>>({
    resolver: zodResolver(extendedInventorySchema),
    defaultValues: {
      itemName: "",
      itemNameUrdu: "",
      category: "",
      currentStock: 0,
      minStockLevel: 0,
      unit: "",
      costPerUnit: 0,
      supplier: "",
    },
  });

  const [stockAdjustment, setStockAdjustment] = useState(0);

  const categories = [
    { value: "vaccine", label: "Vaccines", labelUrdu: "ویکسین" },
    { value: "medicine", label: "Medicines", labelUrdu: "ادویات" },
    { value: "equipment", label: "Equipment", labelUrdu: "آلات" },
    { value: "supplies", label: "Supplies", labelUrdu: "سامان" },
  ];

  const filteredInventory = inventory?.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.itemNameUrdu && item.itemNameUrdu.includes(searchQuery));
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getStockStatus = (item: Inventory) => {
    if (item.currentStock <= item.minStockLevel) return "low";
    if (item.currentStock <= item.minStockLevel * 1.5) return "warning";
    return "good";
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "low": return "text-red-600 bg-red-50 border-red-200";
      case "warning": return "text-orange-600 bg-orange-50 border-orange-200";
      case "good": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getExpiryStatus = (item: Inventory) => {
    if (!item.expiryDate) return null;
    
    const now = new Date();
    const expiryDate = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 30) return "expiring";
    return "good";
  };

  const onSubmitItem = (data: z.infer<typeof extendedInventorySchema>) => {
    addItemMutation.mutate(data);
  };

  const handleStockUpdate = () => {
    if (!selectedItem) return;
    
    const newStock = selectedItem.currentStock + stockAdjustment;
    if (newStock < 0) {
      toast({ title: "Error", description: "Stock cannot be negative", variant: "destructive" });
      return;
    }

    updateStockMutation.mutate({
      id: selectedItem.id,
      data: { currentStock: newStock }
    });
  };

  const totalValue = inventory?.reduce((sum, item) => sum + (item.currentStock * (item.costPerUnit || 0)), 0) || 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("inventory.title")}
            </h1>
            <p className="text-muted-foreground">
              {language === "ur"
                ? "کلینک کی انوینٹری، اسٹاک اور لاگت کا انتظام کریں"
                : "Manage clinic inventory, stock levels, and costs"
              }
            </p>
          </div>
          <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-white" data-testid="add-item-button">
                <Plus className="h-4 w-4 mr-2" />
                {t("inventory.addNew")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onSubmitItem)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="itemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="item-name-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="itemNameUrdu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name (Urdu)</FormLabel>
                        <FormControl>
                          <Input {...field} className="urdu-text" data-testid="item-name-urdu-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="item-category-select">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {language === "ur" ? category.labelUrdu : category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="currentStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="current-stock-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="minStockLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Stock Level</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="min-stock-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="vials, tablets, ml" data-testid="unit-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="costPerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost per Unit (PKR)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="cost-per-unit-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={addForm.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="supplier-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                data-testid="expiry-date-picker"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick expiry date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={addItemMutation.isPending}
                    data-testid="submit-item-button"
                  >
                    {addItemMutation.isPending ? "Adding..." : "Add Item"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search inventory items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-inventory-input"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48" data-testid="filter-category-select">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {language === "ur" ? category.labelUrdu : category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{inventory?.length || 0}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems?.length || 0}</p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{expiringItems?.length || 0}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-green-600">PKR {totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems && lowStockItems.length > 0) || (expiringItems && expiringItems.length > 0) ? (
        <div className="space-y-4 mb-8">
          {lowStockItems && lowStockItems.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{lowStockItems.length} items are low on stock!</strong> Consider restocking soon.
              </AlertDescription>
            </Alert>
          )}
          
          {expiringItems && expiringItems.length > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <CalendarIcon className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>{expiringItems.length} items are expiring within 30 days!</strong> Check expiry dates.
              </AlertDescription>
            </Alert>
          )}
        </div>
      ) : null}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item, index) => {
          const stockStatus = getStockStatus(item);
          const expiryStatus = getExpiryStatus(item);
          
          return (
            <Card key={item.id} className="relative" data-testid={`inventory-item-${index}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.itemName}</CardTitle>
                    {item.itemNameUrdu && (
                      <p className="text-sm text-muted-foreground urdu-text">{item.itemNameUrdu}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {language === "ur" 
                      ? categories.find(c => c.value === item.category)?.labelUrdu
                      : item.category
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stock Level:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(stockStatus)}`}>
                        {item.currentStock} {item.unit}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(item);
                          setStockAdjustment(0);
                          setShowUpdateStock(true);
                        }}
                        data-testid={`update-stock-${index}`}
                      >
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Min Level:</span>
                    <span>{item.minStockLevel} {item.unit}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cost per Unit:</span>
                    <span>PKR {item.costPerUnit}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium">PKR {(item.currentStock * (item.costPerUnit || 0)).toLocaleString()}</span>
                  </div>

                  {item.expiryDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className={expiryStatus === "expiring" ? "text-orange-600 font-medium" : expiryStatus === "expired" ? "text-red-600 font-medium" : ""}>
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {item.supplier && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span>{item.supplier}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || filterCategory !== "all" 
                ? "No items found matching your criteria"
                : "No inventory items yet"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Update Stock Dialog */}
      <Dialog open={showUpdateStock} onOpenChange={setShowUpdateStock}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Stock Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-medium">{selectedItem?.itemName}</p>
              <p className="text-sm text-muted-foreground">
                Current stock: {selectedItem?.currentStock} {selectedItem?.unit}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Stock Adjustment:</label>
              <div className="flex items-center gap-2 mt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setStockAdjustment(prev => prev - 1)}
                  data-testid="decrease-stock"
                >
                  -
                </Button>
                <Input 
                  type="number" 
                  value={stockAdjustment} 
                  onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                  className="text-center"
                  data-testid="stock-adjustment-input"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setStockAdjustment(prev => prev + 1)}
                  data-testid="increase-stock"
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                New stock level: {(selectedItem?.currentStock || 0) + stockAdjustment} {selectedItem?.unit}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleStockUpdate}
                disabled={updateStockMutation.isPending || stockAdjustment === 0}
                className="flex-1"
                data-testid="confirm-stock-update"
              >
                {updateStockMutation.isPending ? "Updating..." : "Update Stock"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUpdateStock(false)}
                data-testid="cancel-stock-update"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
