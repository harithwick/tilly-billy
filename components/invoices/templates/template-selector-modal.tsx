"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCard } from "./template-card";
import { Button } from "@/components/ui/button";

const defaultTemplates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional design",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=500",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional business layout",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=500",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design",
    image:
      "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?q=80&w=500",
  },
];

const customTemplates = [
  {
    id: "custom-1",
    name: "My Template 1",
    description: "Customized for software projects",
    image:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=500",
  },
];

interface TemplateSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (templateId: string) => void;
}

export function TemplateSelectorModal({
  open,
  onOpenChange,
  onSelect,
}: TemplateSelectorModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("default");

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose an Invoice Template</DialogTitle>
          <DialogDescription>
            Select a template to get started or use one of your saved templates.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="default"
          className="mt-4"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="default">Default Templates</TabsTrigger>
            <TabsTrigger value="custom">My Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {defaultTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  name={template.name}
                  description={template.description}
                  image={template.image}
                  selected={selectedTemplate === template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            {customTemplates.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {customTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    name={template.name}
                    description={template.description}
                    image={template.image}
                    selected={selectedTemplate === template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You haven't created any custom templates yet.
                </p>
                <Button variant="outline" className="mt-4">
                  Create Template
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedTemplate}>
            Use Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
