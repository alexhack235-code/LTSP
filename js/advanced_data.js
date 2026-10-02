/**
 * Advanced Training Programme Data:
 * 1. Assembly Language Complete Guide (x86-64 / NASM / Linux SysV)
 * 2. C Programming Complete Guide (Standard C C99/C11/C17)
 * 3. Master Track A: Build Your First Programming Language
 * 4. Master Track B: Build Your First Operating System (Bare-Metal x86-64)
 */

const ADVANCED_TRAINING_DATA = {
  // =========================================================================
  // TRACK A: BUILD YOUR FIRST PROGRAMMING LANGUAGE
  // =========================================================================
  languageTrack: {
    title: "How to Build Your First Programming Language",
    subtitle: "From Source Code to x86-64 Machine Code Compiler using C & Assembly",
    overview: "You will build a real, native compiled language that translates high-level code into executable machine binaries using the x86-64 NASM instructions and C architectures from your compendium.",
    pipeline: [
      {
        step: 1,
        title: "Lexical Analysis (Tokenizer / Lexer)",
        icon: "fa-scissors",
        desc: "Transforms raw string characters into structured stream of Tokens (Keywords, Identifiers, Numbers, Operators).",
        codeSnippet: `typedef enum {
  TOKEN_EOF, TOKEN_INT, TOKEN_PLUS, TOKEN_MINUS,
  TOKEN_STAR, TOKEN_SLASH, TOKEN_LPAREN, TOKEN_RPAREN,
  TOKEN_IDENT, TOKEN_LET, TOKEN_SEMICOLON, TOKEN_RETURN
} TokenType;

typedef struct {
  TokenType type;
  long value;        // For TOKEN_INT
  char name[32];     // For TOKEN_IDENT
} Token;`
      },
      {
        step: 2,
        title: "Parsing & AST Construction",
        icon: "fa-diagram-project",
        desc: "Uses Recursive Descent parsing according to grammar rules to build an Abstract Syntax Tree (AST).",
        codeSnippet: `typedef enum { NODE_NUM, NODE_BINOP, NODE_VAR, NODE_ASSIGN, NODE_RETURN } NodeType;

typedef struct ASTNode {
  NodeType type;
  struct ASTNode *left;
  struct ASTNode *right;
  char op;          // '+', '-', '*', '/'
  long int_val;
  char var_name[32];
} ASTNode;

// Grammar: expr = term (('+' | '-') term)*
ASTNode* parse_expr(Lexer *lex);`
      },
      {
        step: 3,
        title: "Symbol Table & Stack Allocation",
        icon: "fa-table-list",
        desc: "Maps variable names to stack frame offsets [rbp - 8], [rbp - 16] using System V AMD64 stack rules.",
        codeSnippet: `typedef struct {
  char name[32];
  int rbp_offset; // e.g. -8, -16
} Symbol;

Symbol symtab[64];
int sym_count = 0;
int current_stack_offset = 0;

int allocate_var(const char *name) {
  current_stack_offset += 8; // 64-bit quadword
  strcpy(symtab[sym_count].name, name);
  symtab[sym_count].rbp_offset = current_stack_offset;
  return current_stack_offset;
}`
      },
      {
        step: 4,
        title: "x86-64 NASM Code Generation",
        icon: "fa-microchip",
        desc: "Recursively walks the AST and emits native x86-64 assembly instructions using registers and the stack.",
        codeSnippet: `void gen_ast(ASTNode *n) {
  if (n->type == NODE_NUM) {
    printf("  mov rax, %ld\\n", n->int_val);
    printf("  push rax\\n");
    return;
  }
  gen_ast(n->left);
  gen_ast(n->right);
  printf("  pop rbx\\n");  // right operand
  printf("  pop rax\\n");  // left operand
  if (n->op == '+') printf("  add rax, rbx\\n");
  if (n->op == '-') printf("  sub rax, rbx\\n");
  if (n->op == '*') printf("  imul rax, rbx\\n");
  printf("  push rax\\n");
}`
      },
      {
        step: 5,
        title: "Assembler & Linker Pipeline",
        icon: "fa-play",
        desc: "Assembles emitted .asm into an ELF64 object using NASM and links it into a standalone Linux binary.",
        codeSnippet: `# 1. Compile source into assembly
./my_compiler program.toy -o out.asm

# 2. Assemble with NASM
nasm -f elf64 out.asm -o out.o

# 3. Link with GNU ld
ld out.o -o out

# 4. Execute directly!
./out; echo "Exit status: $?"`
      }
    ],
    sampleProgram: {
      source: `let a = 15;
let b = 25 + 5;
return (a * 2) + b;`,
      tokens: `TOKEN_LET
TOKEN_IDENT("a")
TOKEN_ASSIGN
TOKEN_INT(15)
TOKEN_SEMICOLON
TOKEN_LET
TOKEN_IDENT("b")
TOKEN_ASSIGN
TOKEN_INT(25)
TOKEN_PLUS
TOKEN_INT(5)
TOKEN_SEMICOLON
TOKEN_RETURN
TOKEN_LPAREN
TOKEN_IDENT("a")
TOKEN_STAR
TOKEN_INT(2)
TOKEN_RPAREN
TOKEN_PLUS
TOKEN_IDENT("b")
TOKEN_SEMICOLON`,
      nasmAsm: `section .text
global _start

_start:
  push rbp
  mov rbp, rsp
  sub rsp, 32            ; Allocate stack space for variables

  ; a = 15
  mov qword [rbp - 8], 15

  ; b = 25 + 5
  mov rax, 25
  add rax, 5
  mov qword [rbp - 16], rax

  ; return (a * 2) + b
  mov rax, [rbp - 8]     ; rax = a (15)
  imul rax, 2            ; rax = 30
  mov rbx, [rbp - 16]    ; rbx = b (30)
  add rax, rbx           ; rax = 60

  ; Exit syscall with result in rdi
  mov rdi, rax           ; exit status = 60
  mov rax, 60            ; sys_exit
  syscall`
    }
  },

  // =========================================================================
  // TRACK B: BUILD YOUR FIRST OPERATING SYSTEM
  // =========================================================================
  osTrack: {
    title: "How to Build Your First Operating System",
    subtitle: "From Bare-Metal Bootloader to 64-bit C Kernel with Interrupts & Memory Management",
    overview: "Build an operating system from scratch that boots directly on x86-64 hardware without any host OS (no Linux, no Windows). You write the bootloader, switch CPU to 64-bit Long Mode, build a VGA display driver, configure interrupts, and write a kernel shell.",
    stages: [
      {
        stage: 1,
        title: "Stage 1: The 512-Byte Boot Sector",
        icon: "fa-power-off",
        desc: "The BIOS loads sector 0 of the disk (512 bytes) into RAM at physical address 0x7C00 and verifies the magic boot signature 0xAA55.",
        codeSnippet: `; boot.asm - 16-bit Real Mode MBR Bootloader
[bits 16]
[org 0x7c00]

start:
  xor ax, ax
  mov ds, ax
  mov es, ax
  mov ss, ax
  mov sp, 0x7c00        ; Set up stack below bootloader

  mov si, boot_msg
  call print_string

  ; Hang CPU
  cli
  hlt

print_string:
  lodsb
  or al, al
  jz .done
  mov ah, 0x0e          ; BIOS teletype output
  int 0x10
  jmp print_string
.done:
  ret

boot_msg db "Booting Custom ToyOS...", 13, 10, 0

times 510-($-$$) db 0   ; Pad to 510 bytes
dw 0xaa55               ; BIOS Magic Boot Signature`
      },
      {
        stage: 2,
        title: "Stage 2: Jumping to 64-Bit Long Mode",
        icon: "fa-rocket",
        desc: "Set up the Global Descriptor Table (GDT), enable A20 line, configure 4-level paging (PML4), and toggle CR0 to enter 64-bit Long Mode.",
        codeSnippet: `; Entering 64-bit Long Mode
lgdt [gdt_descriptor]   ; Load GDT

; Enable PAE (Physical Address Extension) in CR4
mov eax, cr4
or eax, (1 << 5)
mov cr4, eax

; Load PML4 page table address into CR3
mov eax, 0x1000         ; Page directory base
mov cr3, eax

; Enable Long Mode in EFER MSR
mov ecx, 0xC0000080
rdmsr
or eax, (1 << 8)        ; LM-bit
wrmsr

; Enable Paging and Protected Mode in CR0
mov eax, cr0
or eax, 0x80000001
mov cr0, eax

; Far jump to 64-bit code segment
jmp 0x08:long_mode_entry

[bits 64]
long_mode_entry:
  mov ax, 0x10
  mov ds, ax
  mov ss, ax
  call kernel_main      ; Jump into our C Kernel!`
      },
      {
        stage: 3,
        title: "Stage 3: VGA Text Console Driver (0xb8000)",
        icon: "fa-tv",
        desc: "Direct hardware memory-mapped I/O! Video memory begins at physical RAM 0xb8000. Each character takes 2 bytes: ASCII byte + Color attribute.",
        codeSnippet: `// kernel.c - Bare-metal C Kernel (Freestanding, no stdlib!)
#define VGA_ADDRESS 0xB8000
#define VGA_COLS 80
#define VGA_ROWS 25

volatile unsigned short *vga_buffer = (unsigned short*)VGA_ADDRESS;
int term_col = 0;
int term_row = 0;

void terminal_putchar(char c, unsigned char color) {
  if (c == '\\n') {
    term_col = 0;
    term_row++;
    return;
  }
  const int index = term_row * VGA_COLS + term_col;
  vga_buffer[index] = (unsigned short)c | ((unsigned short)color << 8);
  if (++term_col >= VGA_COLS) {
    term_col = 0;
    term_row++;
  }
}

void kprint(const char *str, unsigned char color) {
  while (*str) terminal_putchar(*str++, color);
}

void kernel_main(void) {
  kprint("Welcome to My Custom 64-Bit OS Kernel!\\n", 0x0A); // Light Green
  kprint("Memory: 0xb8000 initialized. Protected Mode OK.\\n", 0x0F);
}`
      },
      {
        stage: 4,
        title: "Stage 4: Interrupt Descriptor Table (IDT)",
        icon: "fa-bolt-lightning",
        desc: "Handle CPU exceptions (Page Faults, Divide-by-Zero) and hardware interrupts (Timer ticks, Keyboard keystrokes) using 'lidt'.",
        codeSnippet: `struct IDTEntry {
  unsigned short offset_low;
  unsigned short selector;
  unsigned char  ist;
  unsigned char  flags;
  unsigned short offset_mid;
  unsigned int   offset_high;
  unsigned int   reserved;
} __attribute__((packed));

void set_idt_gate(int n, unsigned long handler) {
  idt[n].offset_low  = handler & 0xFFFF;
  idt[n].selector    = 0x08; // Kernel code segment
  idt[n].ist         = 0;
  idt[n].flags       = 0x8E; // Present, Ring 0, 32-bit Interrupt Gate
  idt[n].offset_mid  = (handler >> 16) & 0xFFFF;
  idt[n].offset_high = (handler >> 32) & 0xFFFFFFFF;
}

// Enable interrupts
__asm__ volatile ("sti");`
      },
      {
        stage: 5,
        title: "Stage 5: Memory Paging & Heap Allocator",
        icon: "fa-memory",
        desc: "Implements page frame allocation (4KB physical blocks) and virtual memory mapping to build kernel kmalloc() and free().",
        codeSnippet: `// Simple bump allocator for Kernel Heap
unsigned long heap_current = 0x1000000; // 16MB boundary

void* kmalloc(unsigned long size) {
  // Align to 8 bytes
  size = (size + 7) & ~7;
  void *addr = (void*)heap_current;
  heap_current += size;
  return addr;
}`
      },
      {
        stage: 6,
        title: "Stage 6: User Space & Interactive Kernel Shell",
        icon: "fa-terminal",
        desc: "Separates User Ring 3 from Kernel Ring 0 using 'iretq' or 'syscall', and builds a simple command prompt reading keyboard scan codes.",
        codeSnippet: `void kernel_shell(void) {
  char cmd[64];
  while (1) {
    kprint("os-kernel> ", 0x0B);
    read_line(cmd, sizeof(cmd));
    if (strcmp(cmd, "help") == 0) {
      kprint("Commands: help, uname, mem, clear, reboot\\n", 0x0F);
    } else if (strcmp(cmd, "reboot") == 0) {
      outb(0x64, 0xFE); // Pulse keyboard controller to reboot
    }
  }
}`
      }
    ]
  },

  // =========================================================================
  // ASSEMBLY LANGUAGE COMPLETE GUIDE (x86-64 / NASM / Linux SysV)
  // =========================================================================
  assemblyGuide: {
    title: "Assembly Language Complete Guide (x86-64 / NASM)",
    description: "Every core feature of x86-64 NASM assembly, Linux System V ABI, registers, calling conventions, stack frames, and syscalls.",
    sections: [
      {
        id: "asm-1",
        title: "1. What Assembly Is & Toolchain",
        content: `Assembly is human-readable machine code. An assembler (nasm) turns instructions into machine bytes; a linker (ld) joins object files into an executable.

• Toolchain commands:
  nasm -f elf64 prog.asm -o prog.o    # Assemble
  ld prog.o -o prog                   # Link without libc
  gcc -no-pie prog.o -o prog          # Link with libc (printf, etc.)
  ./prog; echo $?                     # Run & print exit code
  gdb ./prog                          # Debug
  objdump -d -M intel prog            # Disassemble

• Smallest x86-64 Linux Program:
section .text
global _start
_start:
  mov rax, 60     ; Syscall number for exit
  mov rdi, 42     ; Exit status code
  syscall         ; Ask kernel to execute`
      },
      {
        id: "asm-2",
        title: "2. Number Systems, Sizes & Endianness",
        content: `• Data Sizes:
  byte = 8 bits, word = 16 bits, doubleword (dword) = 32 bits, quadword (qword) = 64 bits.

• Literals in NASM:
  10 (decimal), 0x1F or 1Fh (hex), 0b1010 (binary), 'A' (char), "text" (string).

• Two's Complement:
  -1 in 8 bits is 0xFF. The exact same bits represent signed or unsigned numbers. Your choice of conditional jump (e.g., jl vs jb) decides the interpretation!

• Little-Endian:
  Least significant byte stored at the lowest address. E.g., dword 0x12345678 is stored in RAM as: 78 56 34 12.`
      },
      {
        id: "asm-3",
        title: "3. Registers & The 32-bit Zero-Extension Rule",
        content: `x86-64 General Purpose Registers:
  64-bit  | 32-bit | 16-bit | 8-bit low | Purpose
  rax     | eax    | ax     | al        | Accumulator / Syscall & Return Value
  rbx     | ebx    | bx     | bl        | Base register (Callee-saved)
  rcx     | ecx    | cx     | cl        | Loop / Shift counter (4th arg)
  rdx     | edx    | dx     | dl        | Data / High bits of mul/div (3rd arg)
  rsi     | esi    | si     | sil       | Source Index (2nd arg)
  rdi     | edi    | di     | dil       | Destination Index (1st arg)
  rbp     | ebp    | bp     | bpl       | Base / Frame pointer (Callee-saved)
  rsp     | esp    | sp     | spl       | Stack pointer (points to current top)
  r8-r15  | r8d    | r8w    | r8b       | Extra general registers

CRITICAL ZERO-EXTENSION RULE:
Writing to a 32-bit register (e.g. 'mov eax, 1') automatically zeroes the upper 32 bits of the 64-bit register 'rax'!
Writing to 8-bit or 16-bit parts (e.g. 'mov al, 5') leaves the rest of the register untouched.`
      },
      {
        id: "asm-4",
        title: "4. Program Layout: Sections & Directives",
        content: `• Sections:
  .text   -> Executable code (read-only)
  .data   -> Initialized writable data (e.g., counters, tables)
  .rodata -> Initialized read-only constants & string literals
  .bss    -> Uninitialized data (zero-filled at load, takes zero bytes in file)

• Directives:
  db, dw, dd, dq      -> Define byte (1B), word (2B), dword (4B), qword (8B)
  resb, resd, resq    -> Reserve uninitialized bytes, dwords, qwords in .bss
  equ                 -> Define assemble-time constant (no storage)
  $ and $$            -> Current address / Section start address
  msg_len equ $ - msg -> Computes string length at assemble time!`
      },
      {
        id: "asm-5",
        title: "5. Operands & Memory Addressing Modes",
        content: `General Memory Form:
[base + index * scale + displacement]
where scale can be 1, 2, 4, or 8.

Examples:
  mov rax, [rbx]                ; Read quadword at address in rbx
  mov rax, [rbx + 8]            ; Base + displacement
  mov rax, [rbx + rcx * 8]      ; Array lookup: array of 64-bit qwords
  mov eax, [rel count]          ; RIP-relative, position-independent code (PIE)
  mov dword [count], 7          ; Explicit size specifier required for memory + immediate

RULE: Memory-to-memory moves DO NOT EXIST on x86-64! You must load into a register first.`
      },
      {
        id: "asm-6",
        title: "6. Data Movement & LEA",
        content: `• Instructions:
  mov d, s       -> Copy data
  movzx d, s     -> Move with zero extension (unsigned small to big)
  movsx d, s     -> Move with sign extension (signed small to big)
  xchg a, b      -> Swap contents of two registers/memory
  push s / pop d -> Push to stack (rsp -= 8) / Pop from stack (rsp += 8)
  cmovcc d, s    -> Conditional move (cmovne, cmovl, cmovg)

• The Power of LEA (Load Effective Address):
  'lea rax, [rbx + rcx * 4 + 8]' computes the arithmetic result without reading memory!
  'lea eax, [rax + rax * 2]' multiplies eax by 3 in a single instruction without touching CPU flags.`
      },
      {
        id: "asm-7",
        title: "7. System V AMD64 Calling Convention",
        content: `How functions pass parameters and return values on Linux x86-64:

• Passing Integer/Pointer Arguments (in order):
  1st arg: rdi
  2nd arg: rsi
  3rd arg: rdx
  4th arg: rcx
  5th arg: r8
  6th arg: r9
  7th+ args: Pushed onto stack from right to left.

• Return Values:
  Returned in 'rax' (or 'rdx:rax' for 128-bit). Floats returned in 'xmm0'.

• Callee-Saved Registers (MUST BE PRESERVED):
  rbx, rbp, r12, r13, r14, r15 (and rsp). If a function uses them, it must push and pop them back!

• Caller-Saved Registers (May be clobbered):
  rax, rcx, rdx, rsi, rdi, r8-r11, xmm0-15.

• 16-Byte Stack Alignment:
  'rsp' MUST be 16-byte aligned before calling another function (such as printf), otherwise libc crashes with segmentation fault on SIMD movaps!`
      },
      {
        id: "asm-8",
        title: "8. Linux System Calls (syscall)",
        content: `Linux x86-64 System Call Convention:
Put Syscall Number in 'rax'. Arguments go in 'rdi, rsi, rdx, r10, r8, r9'. Then execute 'syscall'.
Result returns in 'rax' (negative value indicates -errno error).

Key Syscall Numbers:
  0   -> sys_read   (rdi=fd, rsi=buf, rdx=count)
  1   -> sys_write  (rdi=fd, rsi=buf, rdx=count)
  2   -> sys_open   (rdi=path, rsi=flags, rdx=mode)
  3   -> sys_close  (rdi=fd)
  9   -> sys_mmap   (rdi=addr, rsi=len, rdx=prot, r10=flags, r8=fd, r9=off)
  12  -> sys_brk    (rdi=addr)
  39  -> sys_getpid ()
  60  -> sys_exit   (rdi=status)`
      }
    ]
  },

  // =========================================================================
  // C PROGRAMMING COMPLETE GUIDE (Standard C C99/C11/C17)
  // =========================================================================
  cGuide: {
    title: "C Programming Complete Guide (C99 / C11 / C17)",
    description: "Memory layout, pointers, structures, dynamic allocation, function pointers, preprocessor, and how C maps directly to Assembly.",
    sections: [
      {
        id: "c-1",
        title: "1. Toolchain & Compilation Stages",
        content: `C compilation occurs in 4 distinct phases:
  1. Preprocessor (gcc -E): Expands #include, evaluates #define macros.
  2. Compiler (gcc -S): Translates C code into x86-64 assembly language.
  3. Assembler (gcc -c): Translates assembly into machine object code (.o).
  4. Linker (ld / gcc): Links object files and libraries into an executable.

• Recommended learning flags:
  gcc -Wall -Wextra -Wpedantic -std=c11 -g -fsanitize=address,undefined main.c -o app`
      },
      {
        id: "c-2",
        title: "2. Process Memory Layout",
        content: `When a C program runs, its virtual memory is divided into standard segments:
  [ Stack ]       -> Grows downwards; stores local variables, function frames, return addresses.
      ↓
  [ Heap ]        -> Grows upwards; dynamic allocations via malloc(), calloc(), realloc().
  [ BSS Segment ] -> Zero-initialized global and static variables.
  [ Data Segment]-> Initialized global and static variables.
  [ Rodata ]      -> Read-only data (string literals "hello", const globals).
  [ Text (Code) ] -> Read-only executable CPU instructions.`
      },
      {
        id: "c-3",
        title: "3. Pointers & Pointer Arithmetic",
        content: `A pointer holds a memory address.
  int x = 10;
  int *p = &x;    // p stores address of x
  *p = 20;        // dereference: writes 20 into x

• Pointer Arithmetic Rule:
  'p + 1' advances by 'sizeof(*p)' bytes, NOT by 1 byte!
  If p is an int* (4 bytes), 'p + 1' increments the address by 4.

• Pointer Hazards:
  - Dangling Pointer: Accessing memory that was already freed.
  - Wild Pointer: Uninitialized pointer pointing to random memory.
  - NULL Dereference: Reading *NULL immediately triggers SIGSEGV.`
      },
      {
        id: "c-4",
        title: "4. Dynamic Memory & Ownership",
        content: `Dynamic memory lives on the Heap until manually freed:
  int *arr = malloc(n * sizeof *arr);
  if (!arr) { perror("malloc"); exit(1); }

  // Use array...
  free(arr);
  arr = NULL; // Prevent use-after-free

Golden Rules:
  1. Every malloc() must have exactly one corresponding free().
  2. Always check for NULL return.
  3. Never use memory after freeing it.
  4. Compile with '-fsanitize=address' to detect leaks and buffer overflows instantly.`
      },
      {
        id: "c-5",
        title: "5. Structures, Unions & Type-Punning",
        content: `• Struct Alignment & Padding:
  CPUs access aligned memory faster. A struct's size may be larger than the sum of its fields due to compiler padding. Use 'offsetof(struct_type, member)' to inspect offsets.

• Self-Referential Structs (The Foundation of ASTs and Linked Lists):
  struct Node {
    int value;
    struct Node *next;
  };

• Unions:
  All members share the same memory location. The size equals the largest member. Used for type-punning and tagged variants.`
      },
      {
        id: "c-6",
        title: "6. Function Pointers & Dispatch Tables",
        content: `Function pointers allow passing functions as callbacks or implementing dynamic dispatch (polymorphism):

typedef int (*BinaryOp)(int, int);

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

// Dispatch table:
BinaryOp ops[] = { add, sub };
int result = ops[0](10, 20); // Calls add(10, 20) -> 30`
      },
      {
        id: "c-7",
        title: "7. How C Maps to Assembly (gcc -S)",
        content: `• Local variable:
  C: 'int a = 5;'
  ASM: 'mov dword [rbp - 4], 5'

• Function call:
  C: 'add(10, 20);'
  ASM: 'mov edi, 10; mov esi, 20; call add'

• Array indexing:
  C: 'arr[i] = 42;'
  ASM: 'mov dword [rdi + rsi * 4], 42'

• If / Else:
  C: 'if (x == 0) foo(); else bar();'
  ASM: 'cmp eax, 0; jne .L_else; call foo; jmp .L_end; .L_else: call bar; .L_end:'`
      }
    ]
  }
};
