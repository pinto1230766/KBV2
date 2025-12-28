import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './FileUpload';
import { useState } from 'react';

const meta = {
  title: 'UI/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

const FileUploadWithState = (args: any) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-96">
      <FileUpload
        {...args}
        onFilesSelected={setFiles}
      />
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Fichiers sélectionnés:</h3>
          <ul className="list-disc pl-5">
            {files.map((file, i) => (
              <li key={i}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Upload de fichiers',
  },
};

export const ImagesOnly: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Upload d\'images',
    accept: 'image/*',
  },
};

export const PDFOnly: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Upload de PDF',
    accept: '.pdf',
  },
};

export const MultipleFiles: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Fichiers multiples',
    multiple: true,
    maxFiles: 5,
  },
};

export const WithSizeLimit: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Taille limitée à 2 MB',
    maxSize: 2 * 1024 * 1024,
  },
};

export const Required: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Upload obligatoire',
    required: true,
  },
};

export const Disabled: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Upload désactivé',
    disabled: true,
  },
};

export const WithPreview: Story = {
  render: (args) => <FileUploadWithState {...args} />,
  args: {
    label: 'Upload avec prévisualisation',
    accept: 'image/*',
    showPreview: true,
  },
};